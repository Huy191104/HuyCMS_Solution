/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    // Controller chính của trang quản trị, hiển thị dashboard với các thống kê tổng quan về hệ thống
    [Authorize]
    public class HomeController : Controller
    {
        // Inject DbContext để truy cập dữ liệu từ database
        private readonly ApplicationDbContext _context;
        // Khởi tạo controller với DbContext được inject từ Dependency Injection
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }
        // Hiển thị dashboard với các thống kê tổng quan về hệ thống, bao gồm tổng số Categories, Posts, Products, Users, Customers, Orders, cũng như số lượng đơn hàng đang chờ xử lý và đã hoàn thành
        public IActionResult Index()
        {
            ViewBag.TotalCategories = _context.Categories.Count();
            ViewBag.TotalPosts = _context.Posts.Count();
            ViewBag.TotalProducts = _context.Products.Count();
            ViewBag.TotalUsers = _context.Users.Count();

            ViewBag.TotalCustomers = _context.Customers.Count();
            ViewBag.TotalOrders = _context.Orders.Count();

            ViewBag.PendingOrders =
                _context.Orders.Count(x => x.Status == 0);

            ViewBag.ShippingOrders =
                _context.Orders.Count(x => x.Status == 1);

            ViewBag.CompletedOrders =
                _context.Orders.Count(x => x.Status == 2);

            ViewBag.LowStockProducts =
                _context.Products.Count(x => x.StockQuantity < 10);

            ViewBag.LatestOrders =
                _context.Orders
                .OrderByDescending(x => x.OrderDate)
                .Take(5)
                .ToList();

            ViewBag.LatestPosts =
                _context.Posts
                .OrderByDescending(x => x.CreatedDate)
                .Take(5)
                .ToList();

            return View();
        }
    }
}