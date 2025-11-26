using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Text;            
using System.Text.Json;        

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        
        private const string PhpPrinterUrl = "http://127.0.0.1:8000/api/print"; 

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


            await EnviarParaImpressoraPhp(order);

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

        private async Task EnviarParaImpressoraPhp(Order order)
        {
            try 
            {
        
                var lines = new List<object>();

           
                lines.Add(new { type = "text", text = "Crepe do Mestre", font_size = 2, align = "center", bold = true });
                lines.Add(new { type = "text", text = "--------------------------------", align = "center" });
                lines.Add(new { type = "text", text = $"Cliente: {order.CustomerName}", align = "left" });

      
                foreach (var item in order.OrderItems)
                {
                    string nomeProd = item.Product?.Name ?? "Produto Removido";
                   
                    lines.Add(new { type = "text", text = $"{item.Quantity}x {nomeProd}", font_size = 1, align = "left" });
                }

                lines.Add(new { type = "text", text = "--------------------------------", align = "center" });

                lines.Add(new { type = "text", text = $"TOTAL: R$ {order.TotalPrice:F2}", bold = true, align = "right", font_size = 2 });

          
                lines.Add(new { type = "qrcode", text = order.Id.ToString(), size = 6 });

                // Rodapé
                lines.Add(new { type = "text", text = $"Pedido #{order.Id}", align = "center" });

                var payload = new { lines = lines };
                var jsonString = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

               
                using (var client = new HttpClient())
                {
               
                    client.Timeout = TimeSpan.FromSeconds(3); 
                    
                    var response = await client.PostAsync(PhpPrinterUrl, content);
                    
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"[SUCESSO] Pedido #{order.Id} enviado para impressão PHP.");
                    }
                    else 
                    {
                        Console.WriteLine($"[ERRO PHP] Código: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
               
                Console.WriteLine($"[ERRO IMPRESSÃO] Falha ao conectar com PHP: {ex.Message}");
            }
        }
    }
}