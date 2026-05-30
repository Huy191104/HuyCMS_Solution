/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================
        // DANH SÁCH BÀI VIẾT
        // ==========================
        public IActionResult Index(int? id)
        {
            var posts = _context.Posts
                .Include(p => p.Category)
                .AsQueryable();

            if (id != null)
            {
                posts = posts.Where(p => p.CategoryId == id);
            }

            var data = posts
                .OrderByDescending(p => p.CreatedDate)
                .ToList();

            return View(data);
        }

        // ==========================
        // CHI TIẾT BÀI VIẾT
        // ==========================
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
                return NotFound();

            return View(post);
        }

        // ==========================
        // TẠO MỚI
        // ==========================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList =
                new SelectList(
                    _context.Categories,
                    "Id",
                    "Name");

            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model, IFormFile? uploadImage)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CategoryList =
                    new SelectList(
                        _context.Categories,
                        "Id",
                        "Name");

                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder =
                    Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "uploads");

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath =
                    Path.Combine(folder, fileName);

                using (var stream =
                       new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl =
                    "/uploads/" + fileName;
            }

            _context.Posts.Add(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // ==========================
        // CHỈNH SỬA
        // ==========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
                return NotFound();

            ViewBag.CategoryList =
                new SelectList(
                    _context.Categories,
                    "Id",
                    "Name",
                    post.CategoryId);

            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model, IFormFile? uploadImage)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CategoryList =
                    new SelectList(
                        _context.Categories,
                        "Id",
                        "Name",
                        model.CategoryId);

                return View(model);
            }

            var oldPost =
                _context.Posts
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == model.Id);

            if (oldPost == null)
                return NotFound();

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder =
                    Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "uploads");

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath =
                    Path.Combine(folder, fileName);

                using (var stream =
                       new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl =
                    "/uploads/" + fileName;
            }
            else
            {
                model.ImageUrl =
                    oldPost.ImageUrl;
            }

            _context.Posts.Update(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // ==========================
        // XÓA
        // ==========================
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
                return NotFound();

            return View(post);
        }

        [HttpPost]
        [ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
                return NotFound();

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
    }
}