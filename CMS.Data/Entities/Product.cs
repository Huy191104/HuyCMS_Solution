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
using System.ComponentModel.DataAnnotations.Schema;


namespace CMS.Data.Entities
{
    // Lớp Product đại diện cho sản phẩm trong hệ thống CMS, có thể là một mặt hàng được bán trong cửa hàng trực tuyến
    public class Product
    {
        [Key]
        public int Id { get; set; } // Mã sản phẩm, khóa chính, tự động tăng

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; } // Tên sản phẩm, bắt buộc nhập

        public string? Description { get; set; } // Mô tả chi tiết về sản phẩm, không bắt buộc

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; } // Giá của sản phẩm, phải là số dương

        public int StockQuantity { get; set; } // Số lượng tồn kho của sản phẩm

        public string? ImageUrl { get; set; } // URL hình ảnh của sản phẩm, không bắt buộc

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; } // Mã danh mục sản phẩm, bắt buộc

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; } // Liên kết tới danh mục sản phẩm mà sản phẩm này thuộc về
    }
}
