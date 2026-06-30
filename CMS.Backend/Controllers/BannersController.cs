/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 26/06/2026
* Version: 1.0
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class BannersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================
        // DANH SÁCH BANNER
        // ==========================
        public IActionResult Index(string search, int page = 1)
        {
            int pageSize = 10;
            var query = _context.Banners.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(b => b.Title.ToLower().Contains(searchLower) || (b.SubTitle != null && b.SubTitle.ToLower().Contains(searchLower)));
            }

            var totalItems = query.Count();
            var data = query
                .OrderBy(b => b.Order)
                .ThenByDescending(b => b.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalItems = totalItems;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            ViewBag.Search = search;

            return View(data);
        }

        // ==========================
        // TẠO MỚI (GET)
        // ==========================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // ==========================
        // TẠO MỚI (POST)
        // ==========================
        [HttpPost]
        public IActionResult Create(Banner model, IFormFile? uploadImage)
        {
            if (uploadImage == null || uploadImage.Length == 0)
            {
                ModelState.AddModelError("ImageUrl", "Vui lòng chọn hình ảnh cho banner.");
            }

            // Loại bỏ kiểm tra tự động trường ImageUrl từ Model vì được gán thủ công sau khi upload
            ModelState.Remove("ImageUrl");

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "banners");
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/banners/" + fileName;
            }

            _context.Banners.Add(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // ==========================
        // CHỈNH SỬA (GET)
        // ==========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound();

            return View(banner);
        }

        // ==========================
        // CHỈNH SỬA (POST)
        // ==========================
        [HttpPost]
        public IActionResult Edit(Banner model, IFormFile? uploadImage)
        {
            // Loại bỏ kiểm tra tự động trường ImageUrl từ Model
            ModelState.Remove("ImageUrl");

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var oldBanner = _context.Banners.AsNoTracking().FirstOrDefault(b => b.Id == model.Id);
            if (oldBanner == null)
                return NotFound();

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "banners");
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/banners/" + fileName;
            }
            else
            {
                model.ImageUrl = oldBanner.ImageUrl;
            }

            _context.Banners.Update(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // ==========================
        // XÓA (GET)
        // ==========================
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound();

            return View(banner);
        }

        // ==========================
        // XÓA (POST CONFIRMED)
        // ==========================
        [HttpPost]
        [ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null)
                return NotFound();

            _context.Banners.Remove(banner);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
    }
}
