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
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    // Controller để quản lý các sản phẩm (Products)
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public ProductsController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }
        // Hiển thị danh sách sản phẩm từ database, bao gồm thông tin liên quan đến CategoryProduct thông qua Include
        public IActionResult Index(int page = 1)
        {
            int pageSize = 9;

            var totalItems = _context.Products.Count();

            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalItems = totalItems;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            return View(data);
        }
        // Hiển thị form để tạo mới sản phẩm, đồng thời truyền danh sách CategoriesProducts từ database để hiển thị trong dropdown list
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = _context.CategoriesProducts.ToList();

            return View();
        }
        // Xử lý dữ liệu từ form tạo mới sản phẩm, thêm sản phẩm vào database và lưu thay đổi
        [HttpPost]
        public IActionResult Create(Product model, IFormFile? ImageFile)
        {
            if (ModelState.IsValid)
            {
                if (ImageFile != null)
                {
                    string fileName =
                        Guid.NewGuid().ToString()
                        + Path.GetExtension(ImageFile.FileName);

                    string uploadFolder =
                        Path.Combine(
                            Directory.GetCurrentDirectory(),
                            "wwwroot/uploads");

                    string filePath =
                        Path.Combine(uploadFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ImageFile.CopyTo(stream);
                    }

                    model.ImageUrl = "/uploads/" + fileName;
                }

                _context.Products.Add(model);

                _context.SaveChanges();

                return RedirectToAction(nameof(Index));
            }

            ViewBag.Categories =
                _context.CategoriesProducts.ToList();

            return View(model);
        }
        //  Hiển thị form để chỉnh sửa sản phẩm, đồng thời truyền danh sách CategoriesProducts từ database để hiển thị trong dropdown list, tìm sản phẩm cần chỉnh sửa dựa trên id được truyền vào
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
                return NotFound();

            ViewBag.Categories = _context.CategoriesProducts.ToList();

            return View(product);
        }
        // Xử lý dữ liệu từ form chỉnh sửa sản phẩm, cập nhật sản phẩm trong database và lưu thay đổi
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile? ImageFile)
        {
            var product = _context.Products.Find(model.Id);

            if (product == null)
                return NotFound();

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.CategoryProductId = model.CategoryProductId;

            if (ImageFile != null)
            {
                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(ImageFile.FileName);

                string uploadFolder =
                    Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/uploads");

                string filePath =
                    Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                product.ImageUrl = "/uploads/" + fileName;
            }

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        // Hiển thị form để xác nhận xóa sản phẩm, tìm sản phẩm cần xóa dựa trên id được truyền vào
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
                return NotFound();

            return View(product);
        }
        // Xử lý yêu cầu xóa sản phẩm khỏi database, tìm sản phẩm cần xóa dựa trên id được truyền vào, nếu tìm thấy thì xóa sản phẩm và lưu thay đổi
        public IActionResult Delete(Product model)
        {
            var product = _context.Products.Find(model.Id);

            if (product == null)
                return NotFound();

            // Kiểm tra sản phẩm đã nằm trong đơn hàng chưa
            if (_context.OrderDetails.Any(x => x.ProductId == model.Id))
            {
                TempData["Error"] =
                    "Sản phẩm đã phát sinh đơn hàng nên không thể xóa.";

                return RedirectToAction(nameof(Index));
            }

            _context.Products.Remove(product);

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
    }
}