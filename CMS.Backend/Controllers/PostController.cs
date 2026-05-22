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
    /// Controller để quản lý các bài viết (Posts) trong hệ thống
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Post/Index hoặc Post/Index/5 (nếu có id danh mục)
        public IActionResult Index(int? id)
        {
            var posts = _context.Posts // Lấy tất cả bài viết
                        .Include(p => p.Category)
                        .AsQueryable();

            // Nếu có id thì lọc theo danh mục
            if (id != null)
            {
                posts = posts.Where(p => p.CategoryId == id); // Lọc bài viết theo CategoryId bằng id truyền vào
            }

            // Sắp xếp mới nhất
            var data = posts
                        .OrderByDescending(p => p.CreatedDate)
                        .ToList();

            return View(data); // Truyền dữ liệu bài viết sang View để hiển thị
        }

        public IActionResult Details(int id) // Hiển thị chi tiết bài viết theo id
        {
            var post = _context.Posts // Lấy bài viết theo id
                        .Include(p => p.Category)
                        .FirstOrDefault(p => p.Id == id);

            if (post == null) // Kiểm tra nếu không tìm thấy bài viết nào với id đó thì trả về lỗi 404 Not Found
            {
                return NotFound();
            }

            return View(post); // Truyền dữ liệu bài viết sang View để hiển thị chi tiết
        }
    }
}