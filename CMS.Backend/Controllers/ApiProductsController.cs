/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    // API Controller để cung cấp dữ liệu về sản phẩm cho frontend
    [Route("api/[controller]")]
    [ApiController]
    // Kế thừa từ ControllerBase vì đây là API Controller, không cần hỗ trợ các tính năng của MVC như Views
    public class ApiProductsController : ControllerBase 
    {
        private readonly ApplicationDbContext _context;

        public ApiProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================
        // GET: api/ProductsApi
        // Lấy toàn bộ sản phẩm
        // =====================================
        [HttpGet]
        public async Task<IActionResult> GetAll() // Sử dụng async/await để không làm nghẽn server khi truy vấn dữ liệu
        {
            var products = await _context.Products // Truy vấn từ bảng Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null
                        ? p.CategoryProduct.Name
                        : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // =====================================
        // GET: api/ProductsApi/categoryproduct/1
        // Lọc sản phẩm theo danh mục
        // =====================================
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToListAsync();

            return Ok(products);
        }

        // =====================================
        // GET: api/ProductsApi/1
        // Chi tiết sản phẩm
        // =====================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            return Ok(new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.StockQuantity,
                product.ImageUrl,
                product.CategoryProductId,
                CategoryName = product.CategoryProduct != null
                    ? product.CategoryProduct.Name
                    : "Không xác định"
            });
        }
    }
}