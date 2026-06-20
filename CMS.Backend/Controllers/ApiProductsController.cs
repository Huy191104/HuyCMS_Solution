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
        // Lấy toàn bộ sản phẩm (Hỗ trợ lọc theo khoảng giá)
        // =====================================
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice) // Sử dụng async/await để không làm nghẽn server khi truy vấn dữ liệu
        {
            var query = _context.Products.Include(p => p.CategoryProduct).AsQueryable();

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var products = await query // Truy vấn từ bảng Products
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
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
                    p.ImageUrl,
                    p.CategoryProductId
                })
                .ToListAsync();

            return Ok(products);
        }

        // =====================================
        // GET: api/ApiProducts/search?q=...
        // Tìm kiếm sản phẩm
        // =====================================
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(new List<object>());
            }

            var query = q.ToLower().Trim();
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Name.ToLower().Contains(query) || (p.Description != null && p.Description.ToLower().Contains(query)))
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null
                        ? p.CategoryProduct.Name
                        : ""
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
        // Lấy sản phẩm mới nhất dựa trên ngày tạo, sắp xếp theo thứ tự giảm dần và giới hạn số lượng trả về bằng tham số take
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewest([FromQuery] int take = 8)
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(take)
                .ToListAsync();
            return Ok(products);
        }

        // Lấy sản phẩm bán chạy nhất dựa trên tổng số lượng đã bán, nhóm theo ProductId, sắp xếp theo tổng số lượng giảm dần và giới hạn số lượng trả về bằng tham số take
        [HttpGet("bestseller")]
        public async Task<IActionResult> GetBestSeller([FromQuery] int take = 8)
        {
            var products = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(od => od.Quantity) })
                .OrderByDescending(x => x.TotalSold)
                .Take(take)
                .Join(_context.Products,
                      x => x.ProductId,
                      p => p.Id,
                      (x, p) => p)
                .ToListAsync();
            return Ok(products);
        }
    }
}