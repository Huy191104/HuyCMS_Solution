/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 26/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    // Controller để quản lý mối quan hệ giữa Categories và Products
    public class CategoriesProductsController : Controller
    {
        // Inject DbContext để truy cập dữ liệu từ database
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }
        // Hiển thị danh sách mối quan hệ giữa Categories và Products
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList(); // Lấy tất cả các mối quan hệ giữa Categories và Products từ database

            return View(data);
        }
    }
}