/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

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
            // ── Thống kê chính ──
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

            // ── Tổng doanh thu (đơn hoàn thành) ──
            ViewBag.TotalRevenue = _context.OrderDetails
                .Where(od => od.Order != null && od.Order.Status == 2)
                .Sum(od => (decimal?)(od.Quantity * od.UnitPrice)) ?? 0;

            // ── Doanh thu 7 ngày gần nhất (cho biểu đồ Chart.js) ──
            var last7Days = Enumerable.Range(0, 7)
                .Select(i => DateTime.Today.AddDays(-6 + i))
                .ToList();

            var revenueData = last7Days.Select(day => new
            {
                Date = day.ToString("dd/MM"),
                Revenue = _context.OrderDetails
                    .Where(od => od.Order != null
                        && od.Order.Status == 2
                        && od.Order.OrderDate.Date == day.Date)
                    .Sum(od => (decimal?)(od.Quantity * od.UnitPrice)) ?? 0
            }).ToList();

            ViewBag.RevenueChartLabels = JsonSerializer.Serialize(revenueData.Select(r => r.Date));
            ViewBag.RevenueChartData = JsonSerializer.Serialize(revenueData.Select(r => r.Revenue));

            // ── Đơn hàng mới nhất (bao gồm Customer) ──
            ViewBag.LatestOrders = _context.Orders
                .Include(x => x.Customer)
                .Include(x => x.OrderDetails)
                .OrderByDescending(x => x.OrderDate)
                .Take(5)
                .ToList();

            // ── Bài viết mới nhất (bao gồm Category) ──
            ViewBag.LatestPosts = _context.Posts
                .Include(x => x.Category)
                .OrderByDescending(x => x.CreatedDate)
                .Take(5)
                .ToList();

            // ── Top sản phẩm sắp hết hàng ──
            ViewBag.LowStockProductList = _context.Products
                .Where(x => x.StockQuantity < 10)
                .OrderBy(x => x.StockQuantity)
                .Take(5)
                .ToList();

            // ── Top 5 sản phẩm bán chạy nhất ──
            var topProducts = _context.OrderDetails
                .Where(od => od.Order != null && od.Order.Status == 2 && od.Product != null)
                .GroupBy(od => od.Product.Name)
                .Select(g => new
                {
                    ProductName = g.Key,
                    QuantitySold = g.Sum(od => od.Quantity)
                })
                .OrderByDescending(x => x.QuantitySold)
                .Take(5)
                .ToList();

            ViewBag.TopProductNames = JsonSerializer.Serialize(topProducts.Select(x => x.ProductName));
            ViewBag.TopProductQuantities = JsonSerializer.Serialize(topProducts.Select(x => x.QuantitySold));

            return View();
        }
    }
}