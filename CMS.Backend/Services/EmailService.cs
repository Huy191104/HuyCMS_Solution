using System.Net;
using System.Net.Mail;
using System.Text;

namespace CMS.Backend.Services
{
    // Dịch vụ EmailService chịu trách nhiệm gửi email xác nhận đặt hàng định dạng HTML cho khách hàng
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOrderConfirmationEmailAsync(
            string customerEmail, 
            string customerName, 
            int orderId, 
            DateTime orderDate, 
            string? notes, 
            List<(string ProductName, int Quantity, decimal UnitPrice)> items, 
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
                bodyBuilder.Append("th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }");
                bodyBuilder.Append("th { background-color: #f7f7f7; font-weight: bold; }");
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
                bodyBuilder.Append("<thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>");
                bodyBuilder.Append("<tbody>");

                foreach (var item in items)
                {
                    var subtotal = item.Quantity * item.UnitPrice;
                    bodyBuilder.Append($"<tr><td>{item.ProductName}</td><td>{item.Quantity}</td><td>{item.UnitPrice:N0} đ</td><td>{subtotal:N0} đ</td></tr>");
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

                Console.WriteLine($"[EmailService] Order confirmation email sent to {customerEmail} for order #{orderId}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] Error sending email: {ex.Message}");
            }
        }
    }
}
