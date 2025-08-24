using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Admin e Atendente
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public OrdersController(AppDbContext db) => _db = db;

        public class CreateOrderRequest
        {
            public List<int> ProductIds { get; set; } = new();
            public string? CustomerName { get; set; }
        }

        [HttpGet]
        public async Task<IEnumerable<Order>> GetAll() =>
            await _db.Orders
                     .Include(o => o.Items)
                     .ThenInclude(i => i.Product)
                     .OrderByDescending(o => o.CreatedAt)
                     .AsNoTracking()
                     .ToListAsync();

        [HttpPost]
        public async Task<ActionResult<Order>> Create([FromBody] CreateOrderRequest req)
        {
            var products = await _db.Products.Where(p => req.ProductIds.Contains(p.Id)).ToListAsync();
            if (products.Count == 0) return BadRequest("Nenhum produto válido informado.");

            var order = new Order
            {
                CustomerName = string.IsNullOrWhiteSpace(req.CustomerName) ? "Cliente" : req.CustomerName!,
                Status = "Pendente",
                CreatedAt = DateTime.UtcNow,
                Items = products.Select(p => new OrderItem { ProductId = p.Id, Quantity = 1 }).ToList()
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            await _db.Entry(order).Collection(o => o.Items).Query().Include(i => i.Product).LoadAsync();
            return CreatedAtAction(nameof(GetAll), new { id = order.Id }, order);
        }

        [HttpPut("{id:int}/ready")]
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
