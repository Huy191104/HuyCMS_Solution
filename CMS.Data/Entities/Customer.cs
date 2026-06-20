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
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Lớp Customer đại diện cho khách hàng trong hệ thống CMS
    public class Customer
    {
        [Key]
        public int Id { get; set; }  // Khóa chính, tự động tăng

        [Required]
        public string FullName { get; set; } // Họ và tên đầy đủ của khách hàng

        [Required]
        [EmailAddress]
        public string Email { get; set; } // Địa chỉ email của khách hàng, phải hợp lệ

        public string? Phone { get; set; } // Số điện thoại của khách hàng, không bắt buộc

        public string? Address { get; set; } // Địa chỉ của khách hàng, không bắt buộc

        [Required]
        public string Password { get; set; } // Lưu mật khẩu (đã hash bằng BCrypt)

        // ── Reset Password ─────────────────────
        public string? ResetPasswordToken { get; set; }       // Token dùng để đặt lại mật khẩu

        public DateTime? ResetPasswordTokenExpiry { get; set; } // Thời hạn của token (1 giờ)

        public virtual ICollection<Order>? Orders { get; set; }
    }
}

