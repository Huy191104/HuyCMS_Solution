/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 22/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách User từ database
        public IActionResult Index()
        {
            var users = _context.Users.ToList();

            return View(users);
        }
        // GET: Hiển thị form tạo mới User
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Nhận dữ liệu từ form và lưu vào database
        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // Lưu User mới vào Database
            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }
        // GET: Hiển thị form kèm dữ liệu cũ của User
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: Thực hiện lưu thay đổi
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null) return NotFound();

            // 2. Xử lý mật khẩu: Nếu nhập mới thì lấy cái mới, nếu trống thì lấy cái cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword; // Sau này sẽ mã hóa tại đây
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            // 3. Cập nhật vào Database
            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Action nhận vào Id của User cần xóa
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng User trong Database bằng Id
            var user = _context.Users.Find(id);
            if (user != null) // Kiểm tra nếu tìm thấy thì mới xóa
            {
                _context.Users.Remove(user); // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.SaveChanges(); // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
            }
            return RedirectToAction("Index"); // Sau khi xóa xong, quay lại trang danh sách để cập nhật giao diện
        }


    }
}