using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public OrdersController(AppDbContext db) => _db = db;

        public class CreateOrderRequest
        {
            public class OrderItemRequest
            {
                public int ProductId { get; set; }
                public int Quantity { get; set; }
            }

            public List<OrderItemRequest> Items { get; set; } = new();
            public string? CustomerName { get; set; }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<Order>> GetAll() =>
            await _db.Orders
                     .Include(o => o.OrderItems)
                     .ThenInclude(i => i.Product)
                     .OrderByDescending(o => o.OrderDate)
                     .AsNoTracking()
                     .ToListAsync();

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Order>> Create([FromBody] CreateOrderRequest req)
        {
            if (req.Items == null || !req.Items.Any())
            {
                return BadRequest("O pedido precisa ter pelo menos um item.");
            }

            var requestedProductIds = req.Items.Select(i => i.ProductId);
            var productsFromDb = await _db.Products
                                    .Where(p => requestedProductIds.Contains(p.Id))
                                    .ToDictionaryAsync(p => p.Id);

            if (productsFromDb.Count != requestedProductIds.Count())
            {
                return BadRequest("Um ou mais produtos informados são inválidos.");
            }

            var orderItems = req.Items.Select(itemReq =>
            {
                var product = productsFromDb[itemReq.ProductId];
                return new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = itemReq.Quantity,
                    UnitPrice = product.Price
                };
            }).ToList();

            var order = new Order
            {
                CustomerName = string.IsNullOrWhiteSpace(req.CustomerName) ? "Cliente" : req.CustomerName!,
                Status = "Recebido",
                OrderDate = DateTime.UtcNow,
                OrderItems = orderItems,
                TotalPrice = orderItems.Sum(oi => oi.UnitPrice * oi.Quantity)
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var createdOrder = await _db.Orders
                                    .Include(o => o.OrderItems)
                                    .ThenInclude(oi => oi.Product)
                                    .FirstOrDefaultAsync(o => o.Id == order.Id);

            return CreatedAtAction(nameof(GetAll), new { id = order.Id }, createdOrder);
        }

        [HttpPost("next")]
        [AllowAnonymous]
        public async Task<ActionResult<Order>> GetNextOrderInQueue()
        {
            var order = await _db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.Status == "Recebido")
                .OrderBy(o => o.OrderDate)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound("Nenhum pedido na fila.");
            }

            order.Status = "Em Preparo";
            await _db.SaveChangesAsync();

            return Ok(order);
        }

        [HttpPut("{id:int}/ready")]
        [AllowAnonymous]
        public async Task<IActionResult> MarkReady(int id)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order is null) return NotFound();
            order.Status = "Pronto";
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order is null) return NotFound();
            _db.Orders.Remove(order);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}