using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using Microsoft.AspNetCore.Hosting;

namespace CMS.Backend.Services
{
    // Dịch vụ EmailService chịu trách nhiệm gửi email xác nhận đặt hàng định dạng HTML cho khách hàng
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EmailService(IConfiguration config, IWebHostEnvironment webHostEnvironment)
        {
            _config = config;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task SendOrderConfirmationEmailAsync(
            string customerEmail, 
            string customerName, 
            int orderId, 
            DateTime orderDate, 
            string? notes, 
            List<(string ProductName, string ImageUrl, int Quantity, decimal UnitPrice)> items, 
            decimal totalAmount)
        {
            try
            {
                var smtpHost = _config["Smtp:Host"];
                var smtpPortStr = _config["Smtp:Port"];
                var smtpUsername = _config["Smtp:Username"];
                var smtpPassword = _config["Smtp:Password"];
                var fromAddress = _config["Smtp:FromAddress"] ?? "no-reply@bakeryhouse.com";
                var fromName = _config["Smtp:FromName"] ?? "Bakery House Support";
                var enableSsl = bool.Parse(_config["Smtp:EnableSsl"] ?? "true");

                // Nếu chưa được cấu hình máy chủ SMTP thật, hệ thống sẽ chạy ở chế độ Demo để tránh phát sinh lỗi hệ thống
                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || smtpUsername.Contains("your-email"))
                {
                    Console.WriteLine($"[EmailService] [DEMO MODE] Skip sending real email (SMTP details not configured).");
                    Console.WriteLine($"[EmailService] Mail to: {customerEmail}");
                    Console.WriteLine($"[EmailService] Subject: [Bakery House] Xác nhận đặt hàng thành công đơn hàng #{orderId}");
                    Console.WriteLine($"[EmailService] Total: {totalAmount:N0} đ");
                    return;
                }

                int smtpPort = int.TryParse(smtpPortStr, out var p) ? p : 587;

                // Xây dựng giao diện Email bằng mã HTML (hỗ trợ hiển thị bảng sản phẩm)
                var bodyBuilder = new StringBuilder();
                bodyBuilder.Append("<html><head><style>");
                bodyBuilder.Append("body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; }");
                bodyBuilder.Append(".container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff; }");
                bodyBuilder.Append(".header { background-color: #8D5B4C; padding: 15px; text-align: center; color: #fff; border-radius: 8px 8px 0 0; }");
                bodyBuilder.Append(".order-details { margin: 20px 0; }");
                bodyBuilder.Append("table { width: 100%; border-collapse: collapse; margin-top: 10px; }");
                bodyBuilder.Append("th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: middle; }");
                bodyBuilder.Append("th { background-color: #f7f7f7; font-weight: bold; }");
                bodyBuilder.Append(".product-img { max-width: 60px; max-height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; display: block; margin: 0 auto; }");
                bodyBuilder.Append(".total { font-size: 16px; font-weight: bold; color: #8D5B4C; text-align: right; margin-top: 15px; }");
                bodyBuilder.Append(".footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }");
                bodyBuilder.Append("</style></head><body>");

                bodyBuilder.Append("<div class='container'>");
                bodyBuilder.Append("<div class='header'><h2>Cảm ơn bạn đã đặt hàng tại Bakery House!</h2></div>");
                bodyBuilder.Append($"<p>Chào <strong>{customerName}</strong>,</p>");
                bodyBuilder.Append($"<p>Đơn hàng của bạn đã được tiếp nhận thành công. Dưới đây là thông tin chi tiết đơn hàng:</p>");
                
                bodyBuilder.Append("<div class='order-details'>");
                bodyBuilder.Append($"<p><strong>Mã đơn hàng:</strong> #{orderId}</p>");
                bodyBuilder.Append($"<p><strong>Ngày đặt:</strong> {orderDate:dd/MM/yyyy HH:mm:ss}</p>");
                bodyBuilder.Append($"<p><strong>Ghi chú đơn hàng:</strong> {(!string.IsNullOrEmpty(notes) ? notes : "Không có")}</p>");
                bodyBuilder.Append("</div>");

                bodyBuilder.Append("<h3>Chi tiết sản phẩm đặt mua:</h3>");
                bodyBuilder.Append("<table>");
                bodyBuilder.Append("<thead><tr><th style='text-align: center; width: 80px;'>Hình ảnh</th><th>Sản phẩm</th><th style='text-align: center;'>Số lượng</th><th style='text-align: right;'>Đơn giá</th><th style='text-align: right;'>Thành tiền</th></tr></thead>");
                bodyBuilder.Append("<tbody>");

                var linkedResources = new List<LinkedResource>();
                int imgIndex = 0;

                foreach (var item in items)
                {
                    var subtotal = item.Quantity * item.UnitPrice;
                    string imgHtml = "<span style='color: #999; font-size: 12px;'>Không có ảnh</span>";

                    if (!string.IsNullOrEmpty(item.ImageUrl))
                    {
                        try
                        {
                            string relativePath = "";
                            if (Uri.TryCreate(item.ImageUrl, UriKind.Absolute, out var uri))
                            {
                                relativePath = uri.LocalPath.TrimStart('/');
                            }
                            else
                            {
                                relativePath = item.ImageUrl.TrimStart('/');
                            }

                            if (relativePath.Contains("?"))
                            {
                                relativePath = relativePath.Split('?')[0];
                            }

                            var physicalPath = Path.Combine(_webHostEnvironment.WebRootPath, relativePath);
                            if (File.Exists(physicalPath))
                            {
                                string cid = $"product_img_{imgIndex++}";
                                imgHtml = $"<img src='cid:{cid}' alt='{item.ProductName}' class='product-img' />";

                                string contentType = MediaTypeNames.Image.Jpeg;
                                var ext = Path.GetExtension(physicalPath).ToLower();
                                if (ext == ".png") contentType = MediaTypeNames.Image.Png;
                                else if (ext == ".gif") contentType = MediaTypeNames.Image.Gif;

                                var resource = new LinkedResource(physicalPath, contentType)
                                {
                                    ContentId = cid
                                };
                                linkedResources.Add(resource);
                            }
                            else
                            {
                                imgHtml = $"<img src='{item.ImageUrl}' alt='{item.ProductName}' class='product-img' />";
                            }
                        }
                        catch
                        {
                            imgHtml = $"<img src='{item.ImageUrl}' alt='{item.ProductName}' class='product-img' />";
                        }
                    }

                    bodyBuilder.Append($"<tr>" +
                                       $"<td style='text-align: center;'>{imgHtml}</td>" +
                                       $"<td>{item.ProductName}</td>" +
                                       $"<td style='text-align: center;'>{item.Quantity}</td>" +
                                       $"<td style='text-align: right;'>{item.UnitPrice:N0} đ</td>" +
                                       $"<td style='text-align: right;'>{subtotal:N0} đ</td>" +
                                       $"</tr>");
                }

                bodyBuilder.Append("</tbody>");
                bodyBuilder.Append("</table>");

                bodyBuilder.Append($"<div class='total'>Tổng tiền thanh toán: {totalAmount:N0} đ</div>");

                bodyBuilder.Append("<p>Chúng tôi sẽ nhanh chóng liên hệ với bạn để xác nhận đơn hàng trước khi giao.</p>");
                bodyBuilder.Append("<div class='footer'>");
                bodyBuilder.Append("<p>Mọi thắc mắc xin liên hệ Hotline: 1900-xxxx hoặc gửi email về support@bakeryhouse.com</p>");
                bodyBuilder.Append("<p>&copy; 2026 Bakery House. All rights reserved.</p>");
                bodyBuilder.Append("</div></div></body></html>");

                using (var mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(fromAddress, fromName);
                    mailMessage.To.Add(new MailAddress(customerEmail));
                    mailMessage.Subject = $"[Bakery House] Xác nhận đặt hàng thành công đơn hàng #{orderId}";

                    string htmlBody = bodyBuilder.ToString();
                    var htmlView = AlternateView.CreateAlternateViewFromString(htmlBody, Encoding.UTF8, MediaTypeNames.Text.Html);
                    foreach (var resource in linkedResources)
                    {
                        htmlView.LinkedResources.Add(resource);
                    }
                    mailMessage.AlternateViews.Add(htmlView);

                    mailMessage.Body = htmlBody;
                    mailMessage.IsBodyHtml = true;
                    mailMessage.BodyEncoding = Encoding.UTF8;

                    using (var smtpClient = new SmtpClient(smtpHost, smtpPort))
                    {
                        smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                        smtpClient.EnableSsl = enableSsl;
                        await smtpClient.SendMailAsync(mailMessage);
                    }
                }

                Console.WriteLine($"[EmailService] Order confirmation email sent to {customerEmail} for order #{orderId}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] Error sending email: {ex.Message}");
            }
        }

        public async Task SendNewPasswordEmailAsync(
            string customerEmail, 
            string customerName, 
            string newPassword)
        {
            try
            {
                var smtpHost = _config["Smtp:Host"];
                var smtpPortStr = _config["Smtp:Port"];
                var smtpUsername = _config["Smtp:Username"];
                var smtpPassword = _config["Smtp:Password"];
                var fromAddress = _config["Smtp:FromAddress"] ?? "no-reply@bakeryhouse.com";
                var fromName = _config["Smtp:FromName"] ?? "Bakery House Support";
                var enableSsl = bool.Parse(_config["Smtp:EnableSsl"] ?? "true");

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || smtpUsername.Contains("your-email"))
                {
                    Console.WriteLine($"[EmailService] [DEMO MODE] Skip sending real email (SMTP details not configured).");
                    Console.WriteLine($"[EmailService] Mail to: {customerEmail}");
                    Console.WriteLine($"[EmailService] Subject: [Bakery House] Khôi phục mật khẩu thành công");
                    Console.WriteLine($"[EmailService] New Password: {newPassword}");
                    return;
                }

                int smtpPort = int.TryParse(smtpPortStr, out var p) ? p : 587;

                var bodyBuilder = new StringBuilder();
                bodyBuilder.Append("<html><head><style>");
                bodyBuilder.Append("body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; }");
                bodyBuilder.Append(".container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff; }");
                bodyBuilder.Append(".header { background-color: #8D5B4C; padding: 15px; text-align: center; color: #fff; border-radius: 8px 8px 0 0; }");
                bodyBuilder.Append(".content { margin: 20px 0; font-size: 15px; }");
                bodyBuilder.Append(".password-box { background-color: #f7f7f7; border: 1px dashed #8D5B4C; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; color: #8D5B4C; border-radius: 4px; margin: 15px 0; letter-spacing: 2px; }");
                bodyBuilder.Append(".footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }");
                bodyBuilder.Append("</style></head><body>");

                bodyBuilder.Append("<div class='container'>");
                bodyBuilder.Append("<div class='header'><h2>Khôi phục mật khẩu - Bakery House</h2></div>");
                bodyBuilder.Append("<div class='content'>");
                bodyBuilder.Append($"<p>Chào <strong>{customerName}</strong>,</p>");
                bodyBuilder.Append("<p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu của bạn. Mật khẩu mới của bạn đã được thiết lập lại thành công dưới đây:</p>");
                bodyBuilder.Append($"<div class='password-box'>{newPassword}</div>");
                bodyBuilder.Append("<p>Vì lý do bảo mật, bạn nên đăng nhập ngay và thay đổi mật khẩu này trong mục thông tin tài khoản.</p>");
                bodyBuilder.Append("</div>");
                bodyBuilder.Append("<div class='footer'>");
                bodyBuilder.Append("<p>Mọi thắc mắc xin liên hệ Hotline: 1900-xxxx hoặc gửi email về support@bakeryhouse.com</p>");
                bodyBuilder.Append("<p>&copy; 2026 Bakery House. All rights reserved.</p>");
                bodyBuilder.Append("</div></div></body></html>");

                using (var mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(fromAddress, fromName);
                    mailMessage.To.Add(new MailAddress(customerEmail));
                    mailMessage.Subject = "[Bakery House] Khôi phục mật khẩu thành công";
                    mailMessage.Body = bodyBuilder.ToString();
                    mailMessage.IsBodyHtml = true;
                    mailMessage.BodyEncoding = Encoding.UTF8;

                    using (var smtpClient = new SmtpClient(smtpHost, smtpPort))
                    {
                        smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                        smtpClient.EnableSsl = enableSsl;
                        await smtpClient.SendMailAsync(mailMessage);
                    }
                }

                Console.WriteLine($"[EmailService] Reset password email sent to {customerEmail}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] Error sending reset password email: {ex.Message}");
            }
        }
    }
}
