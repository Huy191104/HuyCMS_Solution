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
    // Controller để quản lý các sản phẩm (Products)
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public ProductsController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        public IActionResult Index() // Hiển thị danh sách sản phẩm từ database
        {
            var data = _context.Products.ToList(); // Lấy tất cả các sản phẩm từ database và chuyển sang dạng List để hiển thị trên View

            return View(data);
        }
    }
}