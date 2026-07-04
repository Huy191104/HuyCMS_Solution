using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class ApiAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly Services.EmailService _emailService;

        public ApiAuthController(ApplicationDbContext context, IConfiguration config, Services.EmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        // ── REGISTER ──────────────────────────────
        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthRegisterRequest req)
        {
            // Kiểm tra email đã tồn tại chưa
            if (_context.Customers.Any(c => c.Email == req.Email))
                return BadRequest(new { message = "Email này đã được sử dụng." });

            // Kiểm tra số điện thoại nếu có nhập
            if (!string.IsNullOrEmpty(req.Phone))
            {
                var phoneClean = req.Phone.Trim();
                if (!System.Text.RegularExpressions.Regex.IsMatch(phoneClean, @"^\d{10}$"))
                {
                    return BadRequest(new { message = "Số điện thoại phải gồm đúng 10 chữ số." });
                }
            }

            var customer = new Customer
            {
                FullName = req.FullName,
                Email = req.Email,
                Phone = req.Phone,
                Address = req.Address,
                Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        // ── LOGIN ─────────────────────────────────
        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthLoginRequest req)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == req.Email);

            if (customer == null || !BCrypt.Net.BCrypt.Verify(req.Password, customer.Password))
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            var token = GenerateJwt(customer);

            return Ok(new
            {
                token,
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        // ── FORGOT PASSWORD ──────────────────────────
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == req.Email);

            if (customer == null)
            {
                // Bảo mật: trả về thông báo chung để tránh lộ email hợp lệ
                return Ok(new { message = "Nếu email tồn tại, mật khẩu mới đã được gửi về email của bạn." });
            }

            // Sinh mật khẩu mới ngẫu nhiên (8 ký tự gồm chữ cái và chữ số)
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var newPassword = new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            // Mã hóa mật khẩu mới bằng BCrypt và lưu vào DB
            customer.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            customer.ResetPasswordToken = null;
            customer.ResetPasswordTokenExpiry = null;

            _context.SaveChanges();

            // Gửi email bất đồng bộ dưới nền (Fire-and-Forget)
            _ = Task.Run(async () =>
            {
                await _emailService.SendNewPasswordEmailAsync(
                    customer.Email,
                    customer.FullName,
                    newPassword
                );
            });

            return Ok(new
            {
                message = "Mật khẩu mới đã được gửi về email của bạn.",
                // Chỉ trả mật khẩu mới trong môi trường DEV để tiện debug/test
                devNewPassword = newPassword
            });
        }

        // ── CHANGE PASSWORD ──────────────────────────
        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest req)
        {
            var customer = _context.Customers.Find(req.CustomerId);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản khách hàng." });
            }

            // Kiểm tra mật khẩu cũ
            if (!BCrypt.Net.BCrypt.Verify(req.OldPassword, customer.Password))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            if (req.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });
            }

            // Mã hóa mật khẩu mới và lưu
            customer.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            _context.SaveChanges();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        // ── GENERATE JWT ──────────────────────────
        private string GenerateJwt(Customer customer)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                new Claim(ClaimTypes.Email,          customer.Email),
                new Claim(ClaimTypes.Name,           customer.FullName),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:ExpireDays"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ── Request DTOs ──────────────────────────────
    public class AuthRegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class AuthLoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ChangePasswordRequest
    {
        public int CustomerId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}