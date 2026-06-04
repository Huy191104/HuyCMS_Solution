/*
* Sinh viên : Phạm Thanh Huy
* Mã sinh viên: 2122110384
* Lớp: CCQ2211J
* Ngày tạo: 4/06/2026
*/

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    // API Controller để cung cấp dữ liệu về đơn hàng cho Frontend
    [Route("api/[controller]")]
    [ApiController]
    public class ApiOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor để "tiêm" DbContext vào Controller
        public ApiOrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // DTO nhận dữ liệu từ giỏ hàng ReactJS gửi lên
        // =====================================================

        public class CartItemDto
        {
            public int ProductId { get; set; }

            public int Quantity { get; set; }
        }

        public class CheckoutRequestDto
        {
            public int CustomerId { get; set; }

            public string? Notes { get; set; }

            public List<CartItemDto> Items { get; set; }
                = new List<CartItemDto>();
        }

        // =====================================================
        // GET: api/ApiOrders
        // Lấy toàn bộ đơn hàng
        // =====================================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,

                    CustomerName = o.Customer != null
                        ? o.Customer.FullName
                        : ""
                })
                .ToList();

            return Ok(orders);
        }

        // =====================================================
        // GET: api/ApiOrders/1
        // Chi tiết một đơn hàng
        // =====================================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng"
                });
            }

            return Ok(new
            {
                order.Id,
                order.OrderDate,
                order.Status,
                order.Notes,

                Customer = new
                {
                    order.Customer?.Id,
                    order.Customer?.FullName,
                    order.Customer?.Email,
                    order.Customer?.Phone,
                    order.Customer?.Address
                },

                Items = order.OrderDetails?.Select(x => new
                {
                    x.ProductId,
                    ProductName = x.Product != null ? x.Product.Name : "",
                    x.Quantity,
                    x.UnitPrice,
                    Total = x.Quantity * x.UnitPrice
                }),

                TotalAmount = order.OrderDetails != null
                    ? order.OrderDetails.Sum(x => x.Quantity * x.UnitPrice)
                    : 0
            });
        }

        // =====================================================
        // GET: api/ApiOrders/customer/1
        // Lịch sử mua hàng của khách hàng
        // =====================================================
        [HttpGet("customer/{customerId}")]
        public IActionResult GetOrdersByCustomer(int customerId)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.Id == customerId);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,

                    TotalItems = o.OrderDetails != null
                        ? o.OrderDetails.Sum(x => x.Quantity)
                        : 0,

                    TotalAmount = o.OrderDetails != null
                        ? o.OrderDetails.Sum(x => x.Quantity * x.UnitPrice)
                        : 0
                })
                .ToList();

            return Ok(orders);
        }

        // =====================================================
        // POST: api/ApiOrders
        // Đặt hàng từ ReactJS
        // =====================================================
        [HttpPost]
        public IActionResult Create([FromBody] CheckoutRequestDto request)
        {
            // Kiểm tra dữ liệu đầu vào
            if (request == null ||
                request.Items == null ||
                !request.Items.Any())
            {
                return BadRequest(new
                {
                    message = "Giỏ hàng trống"
                });
            }

            // Kiểm tra khách hàng
            var customer = _context.Customers
                .FirstOrDefault(c => c.Id == request.CustomerId);

            if (customer == null)
            {
                return BadRequest(new
                {
                    message = "Khách hàng không tồn tại"
                });
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // ====================================
                    // Tạo đơn hàng
                    // ====================================

                    var order = new Order
                    {
                        CustomerId = request.CustomerId,
                        OrderDate = DateTime.Now,
                        Status = 0,
                        Notes = request.Notes
                    };

                    _context.Orders.Add(order);

                    // Save trước để sinh OrderId
                    _context.SaveChanges();

                    decimal totalAmount = 0;

                    // ====================================
                    // Duyệt danh sách giỏ hàng
                    // ====================================

                    foreach (var item in request.Items)
                    {
                        var product = _context.Products
                            .FirstOrDefault(p => p.Id == item.ProductId);

                        if (product == null)
                        {
                            transaction.Rollback();

                            return BadRequest(new
                            {
                                message = $"Không tìm thấy sản phẩm ID = {item.ProductId}"
                            });
                        }

                        if (item.Quantity <= 0)
                        {
                            transaction.Rollback();

                            return BadRequest(new
                            {
                                message = "Số lượng phải lớn hơn 0"
                            });
                        }

                        if (product.StockQuantity < item.Quantity)
                        {
                            transaction.Rollback();

                            return BadRequest(new
                            {
                                message = $"Sản phẩm {product.Name} không đủ tồn kho"
                            });
                        }

                        // ====================================
                        // Tạo Order Detail
                        // ====================================

                        var detail = new OrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = product.Id,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price
                        };

                        _context.OrderDetails.Add(detail);

                        // ====================================
                        // Trừ tồn kho
                        // ====================================

                        product.StockQuantity -= item.Quantity;

                        totalAmount += item.Quantity * product.Price;
                    }

                    _context.SaveChanges();

                    transaction.Commit();

                    return Ok(new
                    {
                        message = "Đặt hàng thành công",
                        orderId = order.Id,
                        totalAmount
                    });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();

                    return BadRequest(new
                    {
                        message = "Tạo đơn hàng thất bại",
                        error = ex.Message
                    });
                }
            }
        }
    }
}