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
    // Controller quản lý khách hàng trong hệ thống CMS
    public class CustomersController : Controller
    {

        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public CustomersController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        public IActionResult Index() // Hiển thị danh sách khách hàng từ database
        {
            var data = _context.Customers.ToList();

            return View(data);
        }
    }
}