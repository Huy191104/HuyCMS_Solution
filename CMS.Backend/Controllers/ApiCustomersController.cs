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
    // API Controller để cung cấp dữ liệu về khách hàng cho frontend
    [Route("api/[controller]")]
    [ApiController]
    // Kế thừa từ ControllerBase vì đây là API Controller, không cần hỗ trợ các tính năng của MVC như Views
    public class ApiCustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        // Constructor để "tiêm" DbContext vào controller
        public ApiCustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET: api/CustomersApi
        // Danh sách khách hàng
        // =========================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var customers = _context.Customers
                .OrderByDescending(c => c.Id)
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .ToList();

            return Ok(customers);
        }

        // =========================================
        // GET: api/CustomersApi/1
        // Chi tiết khách hàng
        // =========================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.Id == id);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            return Ok(customer);
        }

        // =========================================
        // POST: api/CustomersApi
        // Thêm khách hàng mới
        // =========================================
        [HttpPost]
        public IActionResult Create([FromBody] Customer model)
        {
            try
            {
                _context.Customers.Add(model);

                _context.SaveChanges();

                return Ok(new
                {
                    message = "Thêm khách hàng thành công",
                    data = model
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Thêm khách hàng thất bại",
                    error = ex.Message
                });
            }
        }

        // =========================================
        // PUT: api/CustomersApi/1
        // Cập nhật khách hàng
        // =========================================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Customer model)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            // Cập nhật dữ liệu
            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.Address = model.Address;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật khách hàng thành công"
            });
        }

        // =========================================
        // DELETE: api/CustomersApi/1
        // Xóa khách hàng
        // =========================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            _context.Customers.Remove(customer);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa khách hàng thành công"
            });
        }
    }
}