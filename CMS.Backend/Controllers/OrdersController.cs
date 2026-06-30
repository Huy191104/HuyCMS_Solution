/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 30/05/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using ClosedXML.Excel;
using System.IO;

namespace CMS.Backend.Controllers
{
    [Authorize] // Yêu cầu người dùng phải đăng nhập mới được truy cập vào tất cả các action trong controller này
    // Controller để quản lý Orders trong hệ thống CMS 
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _context; // Inject DbContext để truy cập dữ liệu từ database

        public OrdersController(ApplicationDbContext context) // Khởi tạo controller với DbContext được inject từ Dependency Injection
        {
            _context = context;
        }
        //Hiển thị danh sách Orders từ database, bao gồm thông tin khách hàng liên quan thông qua Include, sắp xếp theo ngày đặt hàng giảm dần, hỗ trợ tìm kiếm và lọc
        public IActionResult Index(string search, int? status, int page = 1) 
        {
            int pageSize = 5;

            var query = _context.Orders
                .Include(o => o.Customer)
                .AsQueryable();

            // Tìm kiếm (theo ID đơn hàng hoặc tên khách hàng)
            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(o => o.Id.ToString().Contains(searchLower) || (o.Customer != null && o.Customer.FullName.ToLower().Contains(searchLower)));
            }

            // Lọc theo trạng thái (0: Chờ duyệt, 1: Đang giao, 2: Đã xong)
            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var totalItems = query.Count();

            var data = query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalItems = totalItems;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            // Các ViewBag phục vụ hiển thị lại form bộ lọc
            ViewBag.Search = search;
            ViewBag.Status = status;

            return View(data);
        }
        // Hiển thị chi tiết của một đơn hàng cụ thể dựa trên id được truyền vào, bao gồm thông tin khách hàng và chi tiết đơn hàng liên quan thông qua Include
        public IActionResult Details(int id) 
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }
        // Hiển thị form để chỉnh sửa trạng thái và ghi chú của một đơn hàng cụ thể dựa trên id được truyền vào
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            if (order.Status == 2)
            {
                TempData["Error"] = "Đơn hàng đã hoàn thành, không thể thay đổi thông tin.";
                return RedirectToAction(nameof(Index));
            }

            return View(order);
        }
        // Xử lý dữ liệu từ form chỉnh sửa đơn hàng, cập nhật trạng thái và ghi chú của đơn hàng trong database
        [HttpPost]
        public IActionResult Edit(Order model)
        {
            var order = _context.Orders.Find(model.Id);

            if (order == null)
                return NotFound();

            if (order.Status == 2)
            {
                TempData["Error"] = "Đơn hàng đã hoàn thành, không thể thay đổi thông tin.";
                return RedirectToAction(nameof(Index));
            }

            order.Status = model.Status;
            order.Notes = model.Notes;

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        // Hiển thị form để xác nhận xóa một đơn hàng cụ thể dựa trên id được truyền vào, bao gồm thông tin khách hàng liên quan thông qua Include
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }
        // Xử lý yêu cầu xóa một đơn hàng cụ thể, bao gồm xóa tất cả chi tiết đơn hàng liên quan trước khi xóa đơn hàng khỏi database
        [HttpPost]
        public IActionResult Delete(Order model)
        {
            var order = _context.Orders.Find(model.Id);

            if (order != null)
            {
                var details = _context.OrderDetails
                    .Where(x => x.OrderId == model.Id);

                _context.OrderDetails.RemoveRange(details);

                _context.Orders.Remove(order);

                _context.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: Orders/ExportToExcel
        [HttpGet]
        public IActionResult ExportToExcel(string search, int? status)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .AsQueryable();

            // Tìm kiếm (theo ID đơn hàng hoặc tên khách hàng)
            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(o => o.Id.ToString().Contains(searchLower) || (o.Customer != null && o.Customer.FullName.ToLower().Contains(searchLower)));
            }

            // Lọc theo trạng thái
            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var orders = query.OrderByDescending(o => o.OrderDate).ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Đơn hàng");

                // Tiêu đề bảng
                worksheet.Cell(1, 1).Value = "Mã đơn";
                worksheet.Cell(1, 2).Value = "Khách hàng";
                worksheet.Cell(1, 3).Value = "Ngày đặt hàng";
                worksheet.Cell(1, 4).Value = "Trạng thái";
                worksheet.Cell(1, 5).Value = "Tổng tiền (VNĐ)";
                worksheet.Cell(1, 6).Value = "Ghi chú";

                // Định dạng tiêu đề cột
                var headerRange = worksheet.Range("A1:F1");
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#16A34A"); // Green Excel
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                worksheet.Row(1).Height = 24;

                int row = 2;
                foreach (var order in orders)
                {
                    worksheet.Cell(row, 1).Value = $"#{order.Id}";
                    worksheet.Cell(row, 2).Value = order.Customer?.FullName ?? "Khách vãng lai";
                    worksheet.Cell(row, 3).Value = order.OrderDate.ToString("dd/MM/yyyy HH:mm");

                    worksheet.Cell(row, 4).Value = order.Status switch
                    {
                        0 => "Chờ duyệt",
                        1 => "Đang giao",
                        2 => "Hoàn thành",
                        3 => "Đã hủy",
                        _ => "Không xác định"
                    };

                    // Tính tổng tiền từ chi tiết đơn hàng
                    decimal totalAmount = order.OrderDetails?.Sum(od => od.Quantity * od.UnitPrice) ?? 0;
                    worksheet.Cell(row, 5).Value = totalAmount;
                    worksheet.Cell(row, 5).Style.NumberFormat.Format = "#,##0"; // Định dạng số phân tách hàng nghìn

                    worksheet.Cell(row, 6).Value = order.Notes ?? "";

                    // Căn lề các ô dữ liệu
                    worksheet.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    worksheet.Cell(row, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    worksheet.Cell(row, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    worksheet.Cell(row, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                    row++;
                }

                // Thiết kế viền mờ cho bảng dữ liệu
                if (row > 2)
                {
                    var dataRange = worksheet.Range($"A1:F{row - 1}");
                    dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                    dataRange.Style.Border.OutsideBorderColor = XLColor.FromHtml("#E9ECEF");
                    dataRange.Style.Border.InsideBorderColor = XLColor.FromHtml("#F1F3F5");
                }

                // Tự động điều chỉnh kích thước cột
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"danh-sach-don-hang-{DateTime.Now:yyyyMMddHHmmss}.xlsx"
                    );
                }
            }
        }

        // POST: Orders/UpdateItemQuantity
        [HttpPost]
        public IActionResult UpdateItemQuantity(int orderId, int detailId, int quantity)
        {
            var order = _context.Orders.Find(orderId);
            if (order == null)
                return NotFound();

            if (order.Status == 2)
            {
                TempData["Error"] = "Đơn hàng đã hoàn thành, không thể thay đổi thông tin.";
                return RedirectToAction(nameof(Edit), new { id = orderId });
            }

            var detail = _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefault(od => od.Id == detailId && od.OrderId == orderId);

            if (detail == null)
                return NotFound();

            if (quantity <= 0)
            {
                TempData["Error"] = "Số lượng phải lớn hơn 0. Nếu muốn xóa sản phẩm, vui lòng chọn nút Xóa.";
                return RedirectToAction(nameof(Edit), new { id = orderId });
            }

            if (detail.Product != null)
            {
                int diff = quantity - detail.Quantity;
                if (diff > detail.Product.StockQuantity)
                {
                    TempData["Error"] = $"Không đủ tồn kho! Sản phẩm {detail.Product.Name} chỉ còn {detail.Product.StockQuantity} chiếc trong kho.";
                    return RedirectToAction(nameof(Edit), new { id = orderId });
                }

                detail.Product.StockQuantity -= diff;
            }

            detail.Quantity = quantity;
            _context.SaveChanges();

            TempData["Success"] = "Cập nhật số lượng sản phẩm thành công.";
            return RedirectToAction(nameof(Edit), new { id = orderId });
        }

        // POST: Orders/DeleteItem
        [HttpPost]
        public IActionResult DeleteItem(int orderId, int detailId)
        {
            var order = _context.Orders.Find(orderId);
            if (order == null)
                return NotFound();

            if (order.Status == 2)
            {
                TempData["Error"] = "Đơn hàng đã hoàn thành, không thể thay đổi thông tin.";
                return RedirectToAction(nameof(Edit), new { id = orderId });
            }

            var detail = _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefault(od => od.Id == detailId && od.OrderId == orderId);

            if (detail == null)
                return NotFound();

            if (detail.Product != null)
            {
                detail.Product.StockQuantity += detail.Quantity; // Cộng lại số lượng tồn kho
            }

            _context.OrderDetails.Remove(detail);
            _context.SaveChanges();

            TempData["Success"] = "Đã xóa sản phẩm khỏi đơn hàng thành công.";
            return RedirectToAction(nameof(Edit), new { id = orderId });
        }
    }
}