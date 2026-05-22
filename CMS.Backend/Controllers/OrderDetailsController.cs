/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 22/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    /// Controller để quản lý OrderDetails trong hệ thống
    public class OrderDetailsController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public OrderDetailsController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }
    }
}