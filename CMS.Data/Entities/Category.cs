/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
* Version: 1.0
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    // Lớp Category đại diện cho một danh mục tin tức trong hệ thống CMS
    public class Category
    {
        public int Id { get; set; } // Khóa chính, tự động tăng
        public string Name { get; set; } = string.Empty; // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; } = string.Empty; // Mô tả ngắn về danh mục

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }
}

