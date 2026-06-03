/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
// Đăng ký dịch vụ hỗ trợ API (nếu cần)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Đăng ký DbContext vào hệ thống
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1. Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
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
