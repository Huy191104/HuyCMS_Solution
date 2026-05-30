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
        public IActionResult Index() // Hiển thị danh sách OrderDetails từ database, bao gồm thông tin sản phẩm liên quan thông qua Include
        {
            var data = _context.OrderDetails
                .Include(o => o.Product)
                .ToList();

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