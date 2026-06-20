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

        public ApiAuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ── REGISTER ──────────────────────────────
        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthRegisterRequest req)
        {
            // Kiểm tra email đã tồn tại chưa
            if (_context.Customers.Any(c => c.Email == req.Email))
                return BadRequest(new { message = "Email này đã được sử dụng." });

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
                return Ok(new { message = "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu." });
            }

            // Tạo token ngẫu nhiên an toàn
            var token = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));

            customer.ResetPasswordToken = token;
            customer.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1); // Token hết hạn sau 1 giờ

            _context.SaveChanges();

            // ⚠️ Môi trường DEV: log token ra console
            // TODO: Thay bằng SMTP email service trong môi trường thật
            var resetLink = $"http://localhost:3000/reset-password?token={token}";
            Console.WriteLine($"[ForgotPassword] Reset link for {req.Email}: {resetLink}");

            return Ok(new
            {
                message = "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
                // Chỉ trả token trong môi trường DEV — xóa dòng này khi lên production
                devToken = token
            });
        }

        // ── RESET PASSWORD ──────────────────────────
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest req)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.ResetPasswordToken == req.Token);

            if (customer == null)
                return BadRequest(new { message = "Token không hợp lệ." });

            if (customer.ResetPasswordTokenExpiry == null ||
                customer.ResetPasswordTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới." });

            if (req.NewPassword.Length < 6)
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự." });

            // Cập nhật mật khẩu mới (hash bằng BCrypt giống Register)
            customer.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            customer.ResetPasswordToken = null;    // Xóa token sau khi dùng
            customer.ResetPasswordTokenExpiry = null;

            _context.SaveChanges();

            return Ok(new { message = "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay." });
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

    public class ResetPasswordRequest
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}