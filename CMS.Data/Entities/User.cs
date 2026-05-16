/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 16/05/2026
* Version: 1.0
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    // Lớp User đại diện cho một người dùng trong hệ thống CMS, có thể là quản trị viên hoặc biên tập viên
    public class User
    {
        public int Id { get; set; } // Khóa chính, tự động tăng
        public string Username { get; set; } // Tên đăng nhập, duy nhất
        public string PasswordHash { get; set; } // Mật khẩu đã được băm để bảo mật
        public string FullName { get; set; } // Họ và tên đầy đủ của người dùng
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}

