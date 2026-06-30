/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký các dịch vụ cần thiết cho ứng dụng
builder.Services.AddControllersWithViews();
// Đăng ký dịch vụ hỗ trợ API (nếu cần)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "Bakery House Web API", 
        Version = "v1",
        Description = "Hệ thống Web API quản lý và đặt hàng tiệm bánh Bakery House"
    });

    // Cấu hình định nghĩa bảo mật JWT Bearer cho Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Nhập Token JWT vào đây theo định dạng: Bearer {token của bạn}",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Áp dụng cơ chế bảo mật JWT cho các Controller/Action có thuộc tính [Authorize]
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header
            },
            new List<string>()
        }
    });
});
// Đăng ký DbContext vào hệ thống
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký dịch vụ gửi email xác nhận đơn hàng
builder.Services.AddScoped<CMS.Backend.Services.EmailService>();

// Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
    })
    // Khai báo dịch vụ xác thực JWT Bearer để hỗ trợ bảo vệ API
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// ---- CẤU HÌNH CORS (THÊM VÀO TRƯỚC builder.Build()) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else // Chỉ kích hoạt Swagger trong môi trường phát triển để tránh lộ thông tin API trong môi trường sản xuất
{
    app.UseSwagger(); // Kích hoạt Swagger chỉ trong môi trường phát triển để tránh lộ thông tin API trong môi trường sản xuất
    app.UseSwaggerUI(); // Kích hoạt giao diện Swagger UI để dễ dàng kiểm tra và gọi API trong quá trình phát triển
}

app.UseHttpsRedirection(); // Tự động chuyển hướng HTTP sang HTTPS để bảo mật hơn
app.UseStaticFiles(); // Cho phép phục vụ các tệp tĩnh như CSS, JS, hình ảnh từ thư mục wwwroot

app.UseRouting(); // Kích hoạt hệ thống định tuyến để xác định cách xử lý các yêu cầu đến

// Kich hoạt chính sách CORS "AllowReactApp" để cho phép ReactJS ở port 3000 gọi tới API của ASP.NET Core
app.UseCors("AllowReactApp");

app.UseAuthentication(); // Kích hoạt hệ thống xác thực để kiểm tra xem người dùng đã đăng nhập hay chưa trước khi cho phép truy cập vào các tài nguyên cần bảo vệ

app.UseAuthorization(); // Kích hoạt hệ thống phân quyền để kiểm tra xem người dùng đã có quyền truy cập vào tài nguyên hay chưa sau khi đã xác thực

app.MapControllers(); // Cho phép sử dụng các API Controller đã định nghĩa trong dự án

app.MapControllerRoute( // Định nghĩa tuyến đường mặc định cho các MVC Controller
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
