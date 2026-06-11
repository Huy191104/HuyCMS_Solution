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
}