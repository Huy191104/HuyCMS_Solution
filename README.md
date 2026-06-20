# HuyCMS_Solution - CMS & E-commerce System

Dự án **HuyCMS_Solution** là một hệ thống quản lý nội dung (CMS) kết hợp tính năng bán hàng trực tuyến (E-commerce). Hệ thống được phát triển với kiến trúc tách biệt giữa **Backend API & Admin Portal (ASP.NET Core)** và **Client Storefront (React SPA)**.

---

## 👨‍💻 Thông tin tác giả
- **Sinh viên**: Phạm Thanh Huy
- **Mã sinh viên**: 2122110384
- **Lớp**: CCQ2211J

---

## 🛠 Công nghệ & Thư viện sử dụng

### 1. Backend & Data (`CMS.Backend` & `CMS.Data`)
* **Framework**: ASP.NET Core 8.0 (hỗ trợ song song cả MVC và REST API)
* **ORM**: Entity Framework Core (EF Core)
* **Database**: SQL Server
* **Bảo mật**: 
  - Xác thực Cookie (Cookie Authentication) cho trang quản trị Admin Portal
  - Xác thực JWT Bearer (JSON Web Token) cho React Frontend
  - Mã hóa mật khẩu bằng `BCrypt.Net`
* **Công cụ hỗ trợ**: Swagger/OpenAPI (để thử nghiệm API)

### 2. Frontend (`cms.frontend`)
* **Framework**: React 19
* **Định tuyến**: React Router v7
* **HTTP Client**: Axios (kết nối và lấy dữ liệu từ Backend)
* **Styling**: Vanilla CSS

---

## 📂 Cấu trúc thư mục dự án

```
HuyCMS_Solution/
├── CMS.Backend/            # Dự án ASP.NET Core (Chứa Controllers, Views, API Endpoints)
├── CMS.Data/               # Thư viện EF Core (Định nghĩa thực thể Entities & DbContext)
├── cms.frontend/           # Ứng dụng ReactJS dành cho khách hàng mua sắm
└── HuyCMS_Solution.sln     # File Visual Studio Solution để quản lý toàn bộ dự án
```

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống:
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/) (Phiên bản LTS)
* SQL Server (hoặc SQL Server Express LocalDB)

---

### Bước 1: Thiết lập Cơ sở dữ liệu (Database)

1. Mở file [appsettings.json](file:///c:/Users/user/source/repos/HuyCMS_Solution/CMS.Backend/appsettings.json) trong dự án `CMS.Backend` để cấu hình chuỗi kết nối SQL Server:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=HuyCMS_Database;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```
2. Thực hiện Migration để tạo các bảng trong cơ sở dữ liệu. Mở **Package Manager Console** trong Visual Studio và chạy lệnh:
   ```powershell
   Update-Database -Project CMS.Data -StartupProject CMS.Backend
   ```
   *Hoặc sử dụng .NET CLI trong terminal tại thư mục gốc:*
   ```bash
   dotnet ef database update --project CMS.Data --startup-project CMS.Backend
   ```

---

### Bước 2: Chạy Backend (ASP.NET Core)

1. Điều hướng vào thư mục `CMS.Backend` và chạy lệnh:
   ```bash
   dotnet run
   ```
2. Sau khi khởi chạy thành công:
   * **Admin Dashboard (MVC)**: Truy cập vào địa chỉ mặc định (ví dụ: `https://localhost:7290`) để quản lý sản phẩm, đơn hàng, bài viết.
   * **API Swagger**: Truy cập vào `https://localhost:7290/swagger` để xem tài liệu API chi tiết.

---

### Bước 3: Chạy Frontend (React)

1. Cấu hình địa chỉ API kết nối: Mở file [axiosClient.js](file:///c:/Users/user/source/repos/HuyCMS_Solution/cms.frontend/src/api/axiosClient.js) và kiểm tra xem cổng Port ở `baseURL` có khớp với Port đang chạy của Backend không:
   ```javascript
   baseURL: 'https://localhost:7290/api'
   ```
2. Điều hướng vào thư mục `cms.frontend` bằng terminal:
   ```bash
   cd cms.frontend
   ```
3. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
4. Khởi động ứng dụng React:
   ```bash
   npm start
   ```
5. Trình duyệt sẽ tự động mở trang web cửa hàng tại địa chỉ `http://localhost:3000`.

---

## 💡 Các chức năng chính của dự án

### 🛍️ Client Storefront (Khách hàng)
- **Xem & Lọc sản phẩm**: Duyệt qua danh sách sản phẩm theo danh mục (`CategoryProduct`).
- **Tin tức & Blog**: Đọc tin tức, các bài viết chia sẻ từ hệ thống CMS (`Category` & `Post`).
- **Giỏ hàng & Đặt hàng**: Thêm sản phẩm vào giỏ hàng, cập nhật số lượng, tạo đơn hàng mới thông qua trang thanh toán (Checkout).
- **Lịch sử đơn hàng**: Đăng ký/Đăng nhập tài khoản khách hàng để theo dõi lịch sử và trạng thái xử lý các đơn hàng đã đặt.

### ⚙️ Admin Portal (Quản trị viên)
- **Quản lý Catalog**: Thêm, sửa, xóa sản phẩm và danh mục sản phẩm.
- **Quản lý Blog**: Tạo mới và chỉnh sửa bài viết tin tức.
- **Quản lý Đơn hàng**: Tiếp nhận đơn đặt hàng từ khách hàng, thay đổi trạng thái đơn hàng (Chờ duyệt -> Đang giao -> Đã xong).
- **Quản lý Người dùng**: Tạo mới tài khoản và phân quyền cho nhân viên biên tập hoặc quản trị viên hệ thống.
