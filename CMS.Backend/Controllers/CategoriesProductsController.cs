/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using CMS.Data.Entities;

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
        // Hiển thị form để tạo mới mối quan hệ giữa Categories và Products
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        // Xử lý dữ liệu từ form tạo mới mối quan hệ giữa Categories và Products
        [HttpPost]
        public IActionResult Create(CategoryProduct model, IFormFile? ImageFile)
        {
            // Xử lý upload ảnh đại diện nếu có
            if (ImageFile != null)
            {
                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(ImageFile.FileName);

                string uploadFolder =
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

                string filePath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.CategoriesProducts.Add(model);

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        // Hiển thị form để chỉnh sửa mối quan hệ giữa Categories và Products
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
                return NotFound();

            return View(category);
        }
        // Xử lý dữ liệu từ form chỉnh sửa mối quan hệ giữa Categories và Products
        [HttpPost]
        public IActionResult Edit(CategoryProduct model, IFormFile? ImageFile)
        {
            var category = _context.CategoriesProducts.Find(model.Id);

            if (category == null)
                return NotFound();

            category.Name = model.Name;
            category.Description = model.Description;

            // Cập nhật ảnh nếu có file mới được upload
            if (ImageFile != null)
            {
                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(ImageFile.FileName);

                string uploadFolder =
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

                string filePath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                category.ImageUrl = "/uploads/" + fileName;
            }

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        // Xử lý yêu cầu xóa mối quan hệ giữa Categories và Products
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
                return NotFound();

            _context.CategoriesProducts.Remove(category);

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
    }
}