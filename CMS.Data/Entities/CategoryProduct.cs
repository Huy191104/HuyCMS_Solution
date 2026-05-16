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
    // Lớp CategoryProduct đại diện cho danh mục sản phẩm, ví dụ: Điện tử, Thời trang, Gia dụng
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; } // Mã danh mục

        [Required(ErrorMessage = "Tên danh mục không được để trống")] // Bắt buộc nhập tên danh mục
        [StringLength(100)] // Giới hạn độ dài tên danh mục
        public string Name { get; set; } // Tên danh mục (vd: Điện tử, Thời trang)

        public string? Description { get; set; } // Mô tả ngắn về danh mục (không bắt buộc)

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}

