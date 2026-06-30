/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 26/06/2026
* Version: 1.0
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiBannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApiBannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ApiBanners/active
        [HttpGet("active")]
        public IActionResult GetActive()
        {
            var activeBanners = _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.Order)
                .ThenByDescending(b => b.Id)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.SubTitle,
                    b.ImageUrl,
                    b.LinkUrl,
                    b.Order
                })
                .ToList();

            return Ok(activeBanners);
        }
    }
}
