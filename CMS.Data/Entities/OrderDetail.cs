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
    /// Lớp OrderDetail đại diện cho chi tiết của một đơn hàng, bao gồm sản phẩm, số lượng và giá tại thời điểm mua
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; } // Khóa chính, tự động tăng

        public int OrderId { get; set; } // Khóa ngoại liên kết tới Order

        public int ProductId { get; set; } // Khóa ngoại liên kết tới Product

        public int Quantity { get; set; } // Số lượng sản phẩm trong đơn hàng

        [Column(TypeName = "decimal(18,2)")] 
        public decimal UnitPrice { get; set; } // Giá tại thời điểm mua

        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; } // Liên kết tới đơn hàng chứa chi tiết này

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; } // Liên kết tới sản phẩm được mua trong chi tiết đơn hàng này
    }
}


