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

namespace CMS.Backend.Controllers
{
    // API Controller để cung cấp dữ liệu về đơn hàng cho frontend
    [Route("api/[controller]")]
    [ApiController]
    // Kế thừa từ ControllerBase vì đây là API Controller, không cần hỗ trợ các tính năng của MVC như Views
    public class ApiOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        // Constructor để "tiêm" DbContext vào controller
        public ApiOrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET: api/OrdersApi
        // Danh sách đơn hàng
        // =========================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,

                    CustomerName = o.Customer != null
                        ? o.Customer.FullName
                        : ""
                })
                .ToList();

            return Ok(orders);
        }

        // =========================================
        // GET: api/OrdersApi/1
        // Chi tiết đơn hàng
        // =========================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng"
                });
            }

            return Ok(order);
        }

        // =========================================
        // POST: api/OrdersApi
        // Tạo đơn hàng mới
        // =========================================
        [HttpPost]
        public IActionResult Create([FromBody] Order model)
        {
            try
            {
                // Gán ngày tạo đơn
                model.OrderDate = DateTime.Now;

                // Trạng thái mặc định
                model.Status = 0;

                // Thêm vào database
                _context.Orders.Add(model);

                // Lưu SQL Server
                _context.SaveChanges();

                return Ok(new
                {
                    message = "Tạo đơn hàng thành công",
                    data = model
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Tạo đơn hàng thất bại",
                    error = ex.Message
                });
            }
        }
    }
}