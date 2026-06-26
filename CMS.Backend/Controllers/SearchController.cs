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
    // Controller xử lý chức năng tìm kiếm toàn cục trên trang quản trị
    [Authorize]
    public class SearchController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SearchController(ApplicationDbContext context)
        {
            _context = context;
        }

        // API tìm kiếm toàn cục: tìm trong đơn hàng, sản phẩm, bài viết, khách hàng
        [HttpGet]
        public IActionResult Query(string q)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 1)
            {
                return Json(new { orders = Array.Empty<object>(), products = Array.Empty<object>(), posts = Array.Empty<object>(), customers = Array.Empty<object>() });
            }

            var keyword = q.Trim().ToLower();

            // Tìm đơn hàng theo ID hoặc tên khách hàng
            var orders = _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.Id.ToString().Contains(keyword)
                    || (o.Customer != null && o.Customer.FullName.ToLower().Contains(keyword)))
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    CustomerName = o.Customer != null ? o.Customer.FullName : "N/A",
                    OrderDate = o.OrderDate.ToString("dd/MM/yyyy"),
                    o.Status,
                    Url = $"/Orders/Edit/{o.Id}"
                })
                .ToList();

            // Tìm sản phẩm theo tên
            var products = _context.Products
                .Where(p => p.Name.ToLower().Contains(keyword))
                .OrderBy(p => p.Name)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    Price = p.Price.ToString("N0") + "₫",
                    p.StockQuantity,
                    Url = $"/Products/Edit/{p.Id}"
                })
                .ToList();

            // Tìm bài viết theo tiêu đề
            var posts = _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Title.ToLower().Contains(keyword))
                .OrderByDescending(p => p.CreatedDate)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    Category = p.Category != null ? p.Category.Name : "",
                    CreatedDate = p.CreatedDate.ToString("dd/MM/yyyy"),
                    Url = $"/Post/Edit/{p.Id}"
                })
                .ToList();

            // Tìm khách hàng theo tên hoặc email
            var customers = _context.Customers
                .Where(c => c.FullName.ToLower().Contains(keyword)
                    || c.Email.ToLower().Contains(keyword))
                .OrderBy(c => c.FullName)
                .Take(5)
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    Url = $"/Customers/Edit/{c.Id}"
                })
                .ToList();

            return Json(new { orders, products, posts, customers });
        }
    }
}
