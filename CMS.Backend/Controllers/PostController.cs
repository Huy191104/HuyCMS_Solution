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
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Posts.ToList();

            return View(data);
        }

        public IActionResult Details(int id)
        {
            var post = _context.Posts.FirstOrDefault(x => x.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }
    }
}