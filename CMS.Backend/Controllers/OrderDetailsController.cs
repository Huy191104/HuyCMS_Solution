/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 26/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    // Controller để quản lý OrderDetails trong hệ thống
    public class OrderDetailsController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public OrderDetailsController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }

        // GET: OrderDetails
        public IActionResult Index()
        {
            var data = _context.OrderDetails.ToList(); // Lấy tất cả OrderDetails từ database và chuyển sang view để hiển thị

            return View(data); // Trả về view với dữ liệu OrderDetails để hiển thị danh sách chi tiết đơn hàng
        }
        // GET: OrderDetails/Details/5
        public IActionResult Details(int id)
        {
            var orderDetail = _context.OrderDetails // Truy vấn OrderDetails từ database dựa trên id được truyền vào
                .FirstOrDefault(o => o.Id == id); // Lấy chi tiết đơn hàng có id trùng với id được truyền vào

            if (orderDetail == null) // Nếu không tìm thấy chi tiết đơn hàng nào có id trùng với id được truyền vào, trả về NotFound (404)
            {
                return NotFound(); // Trả về lỗi 404 nếu không tìm thấy chi tiết đơn hàng
            }

            return View(orderDetail); // Trả về view với chi tiết đơn hàng để hiển thị thông tin chi tiết của đơn hàng đó
        }
    }
}