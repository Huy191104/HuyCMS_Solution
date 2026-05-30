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
    // Controller để quản lý Orders trong hệ thống CMS 
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public OrdersController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }
        //Hiển thị danh sách Orders từ database, bao gồm thông tin khách hàng liên quan thông qua Include, sắp xếp theo ngày đặt hàng giảm dần
        public IActionResult Index() 
        {
            var data = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            return View(data);
        }
        // Hiển thị chi tiết của một đơn hàng cụ thể dựa trên id được truyền vào, bao gồm thông tin khách hàng và chi tiết đơn hàng liên quan thông qua Include
        public IActionResult Details(int id) 
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }
        // Hiển thị form để chỉnh sửa trạng thái và ghi chú của một đơn hàng cụ thể dựa trên id được truyền vào
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);

            if (order == null)
                return NotFound();

            return View(order);
        }
        // Xử lý dữ liệu từ form chỉnh sửa đơn hàng, cập nhật trạng thái và ghi chú của đơn hàng trong database
        [HttpPost]
        public IActionResult Edit(Order model)
        {
            var order = _context.Orders.Find(model.Id);

            if (order == null)
                return NotFound();

            order.Status = model.Status;
            order.Notes = model.Notes;

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        // Hiển thị form để xác nhận xóa một đơn hàng cụ thể dựa trên id được truyền vào, bao gồm thông tin khách hàng liên quan thông qua Include
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }
        // Xử lý yêu cầu xóa một đơn hàng cụ thể, bao gồm xóa tất cả chi tiết đơn hàng liên quan trước khi xóa đơn hàng khỏi database
        [HttpPost]
        public IActionResult Delete(Order model)
        {
            var order = _context.Orders.Find(model.Id);

            if (order != null)
            {
                var details = _context.OrderDetails
                    .Where(x => x.OrderId == model.Id);

                _context.OrderDetails.RemoveRange(details);

                _context.Orders.Remove(order);

                _context.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}