/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 26/05/2026
*/

using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thư mục chứa DbContext [cite: 568]
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{

    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất
            var latestPosts = _context.Posts
                              .Include(p => p.Category) // Lấy kèm tên danh mục để hiển thị 
                              .OrderByDescending(p => p.CreatedDate) // Sắp xếp ngày mới nhất lên đầu 
                              .Take(3) // Chỉ lấy đúng 3 bản tin đầu tiên
                              .ToList();

            return View(latestPosts);
        }
    }
}
