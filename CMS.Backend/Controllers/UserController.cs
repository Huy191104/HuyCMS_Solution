/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được phép vào
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

            // Mã hóa mật khẩu trước khi lưu
            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);

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

            // 2. Xử lý mật khẩu: Nếu nhập mới thì lấy cái mới (và mã hóa), nếu trống thì lấy cái cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(NewPassword);
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
        // GET: Hiển thị form xác nhận xóa User
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound();

            return View(user);
        }
        // POST: Thực hiện xóa User khỏi database
        [HttpPost]
        [ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound();

            if (user.Username == User.Identity?.Name)
            {
                TempData["Error"] =
                    "Không thể xóa tài khoản đang đăng nhập.";

                return RedirectToAction(nameof(Index));
            }

            _context.Users.Remove(user);

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }


    }
}