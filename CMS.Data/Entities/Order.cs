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
    /// Lớp Order đại diện cho một đơn hàng được tạo bởi khách hàng, chứa thông tin về ngày đặt hàng, trạng thái và các chi tiết đơn hàng
    public class Order
    {
        [Key]
        public int Id { get; set; } // Khóa chính, tự động tăng

        public DateTime OrderDate { get; set; } = DateTime.Now; // Ngày đặt hàng, mặc định là thời điểm hiện tại
        public int CustomerId { get; set; } // Khóa ngoại liên kết tới Customer

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; } // Ghi chú thêm về đơn hàng, không bắt buộc

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; } // Liên kết tới khách hàng đã đặt đơn hàng

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}


