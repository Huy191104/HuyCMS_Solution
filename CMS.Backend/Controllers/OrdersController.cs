/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 17/05/2026
* Version: 1.0
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    /// Controller để quản lý Orders trong hệ thống CMS 
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public OrdersController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        public IActionResult Index() // Hiển thị danh sách Orders từ database
        {
            var data = _context.Orders.ToList(); // Lấy tất cả các Orders từ database và chuyển sang dạng List để hiển thị trên View

            return View(data);
        }
    }
}