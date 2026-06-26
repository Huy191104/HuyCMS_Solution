/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    // Controller để quản lý OrderDetails trong hệ thống
    public class OrderDetailsController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public OrderDetailsController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        // GET: OrderDetails
        public IActionResult Index(string search, int? productId, int? orderId, int page = 1) // Hiển thị danh sách OrderDetails từ database, bao gồm thông tin sản phẩm liên quan thông qua Include, hỗ trợ tìm kiếm và lọc
        {
            int pageSize = 5;

            var query = _context.OrderDetails
                .Include(o => o.Product)
                .AsQueryable();

            // Tìm kiếm theo ID chi tiết hoặc ID đơn hàng hoặc tên sản phẩm
            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(o => o.Id.ToString().Contains(searchLower) || o.OrderId.ToString().Contains(searchLower) || (o.Product != null && o.Product.Name.ToLower().Contains(searchLower)));
            }

            // Lọc theo sản phẩm
            if (productId.HasValue)
            {
                query = query.Where(o => o.ProductId == productId.Value);
            }

            // Lọc theo đơn hàng (Mã đơn hàng)
            if (orderId.HasValue)
            {
                query = query.Where(o => o.OrderId == orderId.Value);
            }

            var totalItems = query.Count();

            var data = query
                .OrderByDescending(o => o.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalItems = totalItems;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            // Các ViewBag phục vụ hiển thị lại form bộ lọc
            ViewBag.Search = search;
            ViewBag.ProductId = productId;
            ViewBag.OrderId = orderId;
            ViewBag.ProductsList = _context.Products.ToList();

            return View(data);
        }
        // GET: OrderDetails/Details
        public IActionResult Details(int id)
        {
            var orderDetail = _context.OrderDetails // Truy vấn OrderDetails từ database dựa trên id được truyền vào
                .FirstOrDefault(o => o.Id == id); 

            if (orderDetail == null) 
            {
                return NotFound();
            }

            return View(orderDetail);
        }
    }
}