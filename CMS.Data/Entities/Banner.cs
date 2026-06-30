/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 26/06/2026
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
    // Lớp Banner đại diện cho các biểu ngữ động hiển thị slide tại trang chủ của Storefront
    public class Banner
    {
        [Key]
        public int Id { get; set; } // Mã khóa chính tự tăng

        [Required(ErrorMessage = "Tiêu đề banner không được để trống")]
        [StringLength(150)]
        public string Title { get; set; } // Tiêu đề lớn hiển thị trên slide

        [StringLength(250)]
        public string? SubTitle { get; set; } // Phụ đề nhỏ hiển thị bên dưới tiêu đề

        [Required(ErrorMessage = "Hình ảnh banner không được để trống")]
        public string ImageUrl { get; set; } // Đường dẫn ảnh banner (uploads)

        [StringLength(250)]
        public string? LinkUrl { get; set; } // Đường dẫn liên kết khi nhấn vào banner (không bắt buộc)

        public int Order { get; set; } = 0; // Thứ tự hiển thị của slide

        public bool IsActive { get; set; } = true; // Trạng thái hoạt động (true: hiển thị, false: ẩn)
    }
}
