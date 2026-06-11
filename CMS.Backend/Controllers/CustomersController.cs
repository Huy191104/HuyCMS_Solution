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
using BCrypt.Net;


namespace CMS.Backend.Controllers
{
    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    // Controller quản lý khách hàng trong hệ thống CMS
    public class CustomersController : Controller
    {

        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public CustomersController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        public IActionResult Index() // Hiển thị danh sách khách hàng cùng với các đơn hàng của họ
        {
            var data = _context.Customers
                .Include(c => c.Orders)
                .ToList();

            return View(data);
        }
        // Hiển thị form để tạo mới khách hàng
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        // Xử lý dữ liệu từ form tạo mới khách hàng, thêm khách hàng vào database và lưu thay đổi
        [HttpPost]
        public IActionResult Create(Customer model)
        {
            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
        // Hiển thị form để tạo mới khách hàng
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }
        // Xử lý dữ liệu từ form chỉnh sửa khách hàng và cập nhật vào database
        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            var customer = _context.Customers.Find(model.Id);

            if (customer == null)
                return NotFound();

            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.Address = model.Address;

            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                customer.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
            }

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        // Xóa khách hàng khỏi database dựa trên Id
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }
        // Xử lý yêu cầu xóa khách hàng khỏi database
        [HttpPost]
        public IActionResult Delete(Customer model)
        {
            var customer = _context.Customers.Find(model.Id);

            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}