/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 21/06/2026
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // Controller xử lý chức năng thông báo trên trang quản trị
    [Authorize]
    public class NotificationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // API lấy danh sách thông báo tự động sinh từ dữ liệu hệ thống
        [HttpGet]
        public IActionResult GetAll()
        {
            var notifications = new List<object>();
            var now = DateTime.Now;

            // ── Đơn hàng mới chờ duyệt (trong 24h gần nhất) ──
            var pendingOrders = _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.Status == 0 && o.OrderDate >= now.AddHours(-24))
                .OrderByDescending(o => o.OrderDate)
                .Take(10)
                .ToList();

            foreach (var order in pendingOrders)
            {
                var customerName = order.Customer?.FullName ?? "Khách hàng";
                var minutesAgo = (int)(now - order.OrderDate).TotalMinutes;
                var timeText = minutesAgo < 60
                    ? $"{minutesAgo} phút trước"
                    : $"{minutesAgo / 60} giờ trước";

                notifications.Add(new
                {
                    Icon = "bi-cart-plus",
                    Color = "#F59E0B",
                    Title = $"Đơn hàng #{order.Id} mới",
                    Message = $"{customerName} vừa đặt đơn hàng",
                    Time = timeText,
                    Url = $"/Orders/Edit/{order.Id}",
                    SortDate = order.OrderDate
                });
            }

            // ── Sản phẩm sắp hết hàng ──
            var lowStockProducts = _context.Products
                .Where(p => p.StockQuantity < 10)
                .OrderBy(p => p.StockQuantity)
                .Take(5)
                .ToList();

            foreach (var product in lowStockProducts)
            {
                notifications.Add(new
                {
                    Icon = "bi-exclamation-triangle",
                    Color = "#EF4444",
                    Title = "Sắp hết hàng",
                    Message = $"{product.Name} — còn {product.StockQuantity} sản phẩm",
                    Time = "Cảnh báo",
                    Url = $"/Products/Edit/{product.Id}",
                    SortDate = now // Luôn hiển thị ở trên cùng
                });
            }

            // ── Bài viết mới được tạo (trong 24h gần nhất) ──
            var recentPosts = _context.Posts
                .Where(p => p.CreatedDate >= now.AddHours(-24))
                .OrderByDescending(p => p.CreatedDate)
                .Take(5)
                .ToList();

            foreach (var post in recentPosts)
            {
                var minutesAgo = (int)(now - post.CreatedDate).TotalMinutes;
                var timeText = minutesAgo < 60
                    ? $"{minutesAgo} phút trước"
                    : $"{minutesAgo / 60} giờ trước";

                notifications.Add(new
                {
                    Icon = "bi-file-earmark-text",
                    Color = "#3B82F6",
                    Title = "Bài viết mới",
                    Message = post.Title.Length > 40 ? post.Title.Substring(0, 40) + "..." : post.Title,
                    Time = timeText,
                    Url = $"/Post/Edit/{post.Id}",
                    SortDate = post.CreatedDate
                });
            }

            // Sắp xếp theo thời gian mới nhất
            var sorted = notifications
                .OrderByDescending(n => ((dynamic)n).SortDate)
                .ToList();

            return Json(new
            {
                Count = sorted.Count,
                Items = sorted
            });
        }
    }
}
