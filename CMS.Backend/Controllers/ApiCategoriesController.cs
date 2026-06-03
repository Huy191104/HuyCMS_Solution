/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 03/06/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApiCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================
        // GET: api/ApiCategories
        // Lấy toàn bộ danh mục bài viết
        // =====================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .OrderByDescending(c => c.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        // =====================================
        // GET: api/ApiCategories/1
        // Chi tiết danh mục bài viết
        // =====================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            return Ok(category);
        }
    }
}