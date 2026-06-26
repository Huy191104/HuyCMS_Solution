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

        public IActionResult Index(string search, string orderStatus, int page = 1) // Hiển thị danh sách khách hàng cùng với các đơn hàng của họ, hỗ trợ tìm kiếm và lọc
        {
            int pageSize = 5;

            var query = _context.Customers
                .Include(c => c.Orders)
                .AsQueryable();

            // Tìm kiếm theo tên, email hoặc số điện thoại
            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(c => c.FullName.ToLower().Contains(searchLower) || c.Email.ToLower().Contains(searchLower) || c.Phone.ToLower().Contains(searchLower));
            }

            // Lọc theo lịch sử đặt hàng (hasorders / noorders)
            if (!string.IsNullOrEmpty(orderStatus))
            {
                if (orderStatus == "hasorders")
                {
                    query = query.Where(c => c.Orders != null && c.Orders.Any());
                }
                else if (orderStatus == "noorders")
                {
                    query = query.Where(c => c.Orders == null || !c.Orders.Any());
                }
            }

            var totalItems = query.Count();

            var data = query
                .OrderByDescending(c => c.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalItems = totalItems;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            // Các ViewBag phục vụ hiển thị lại form bộ lọc
            ViewBag.Search = search;
            ViewBag.OrderStatus = orderStatus;

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
            // Kiểm tra email trùng
            if (_context.Customers.Any(c => c.Email == model.Email))
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng.");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
        // Hiển thị form để chỉnh sửa khách hàng
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
            // Kiểm tra email trùng với người khác
            if (_context.Customers.Any(c => c.Email == model.Email && c.Id != model.Id))
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng bởi tài khoản khác.");
            }

            // Loại bỏ kiểm tra Password vì password được phép để trống nếu không đổi
            ModelState.Remove("Password");

            if (!ModelState.IsValid)
            {
                return View(model);
            }

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