/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // API Controller để cung cấp dữ liệu cho frontend về mối quan hệ giữa Categories và Products
    [Route("api/[controller]")]
    [ApiController] 
    // Kế thừa từ ControllerBase vì đây là API Controller, không cần hỗ trợ các tính năng của MVC như Views
    public class ApiCategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        // Constructor để "tiêm" DbContext vào controller
        public ApiCategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesProductsApi
        // Phương thức GET để lấy tất cả các mối quan hệ giữa Categories và Products
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.CategoriesProducts
                .OrderByDescending(c => c.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.ImageUrl
                })
                .ToList();

            return Ok(data);
        }
    }
}