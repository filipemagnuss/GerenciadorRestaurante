using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public IActionResult GetDashboardData()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = $"Bem-vindo, {username}! Você acessou a área de administrador com sucesso.",
                userRole = role
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult>GetStats()
        {
            var today = DateTime.UtcNow.Date;

            var ordersInProgress = await _context.Orders
                .CountAsync(o => o.Status == "Recebido" || o.Status == "Em Preparo");

            var todayRevenue = await _context.Orders
                .Where(o => o.OrderDate.Date == today)
                .SumAsync(o => o.TotalPrice);

            var itemsSoldToday = await _context.OrderItems
                .Where(oi => oi.Order.OrderDate.Date == today)
                .SumAsync(oi => oi.Quantity);

            var salesData = await _context.OrderItems
                .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .GroupBy(oi => new { CatName = oi.Product.Category.Name, ProdName = oi.Product.Name })
                .Select(g => new 
                { 
                    Category = g.Key.CatName, 
                    Product = g.Key.ProdName, 
                    Sold = g.Sum(oi => oi.Quantity) 
                })
                .ToListAsync();

            var topSellers = salesData
                .GroupBy(x => x.Category)
                .Select(g => g.OrderByDescending(x => x.Sold).First())
                .Select(x => new { category = x.Category, nome = x.Product, vendidos = x.Sold })
                .ToList();

            return Ok(new
            {
                ordersInProgress,
                todayRevenue,
                itemsSoldToday,
                topSellers
            });
        }
    }
}