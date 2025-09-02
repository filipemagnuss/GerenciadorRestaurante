using backend.Data;
using backend.Dtos; // Importante: Adicionar o using para os DTOs
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Apenas Admins podem gerenciar produtos
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            return await _db.Products
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    IsPromotion = p.IsPromotion,
                    Category = p.Category == null ? null : new CategoryDto
                    {
                        Id = p.Category.Id,
                        Name = p.Category.Name
                    }
                })
                .AsNoTracking()
                .ToListAsync();
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var productDto = await _db.Products
                .Where(p => p.Id == id)
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    IsPromotion = p.IsPromotion,
                    Category = p.Category == null ? null : new CategoryDto
                    {
                        Id = p.Category.Id,
                        Name = p.Category.Name
                    }
                })
                .FirstOrDefaultAsync();

            if (productDto == null)
            {
                return NotFound();
            }

            return productDto;
        }

        // POST: api/products
        // Cria um novo produto
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateOrUpdateProductDto productDto)
        {
            // Mapeia o DTO de entrada para o modelo do banco de dados
            var newProduct = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                IsPromotion = productDto.IsPromotion,
                CategoryId = productDto.CategoryId
            };

            _db.Products.Add(newProduct);
            await _db.SaveChangesAsync();
            
            // Recarrega o produto com a categoria para retornar o DTO completo
            var productResultDto = await GetProduct(newProduct.Id);

            return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, productResultDto.Value);
        }

        // PUT: api/products/5
        // Atualiza um produto existente
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateOrUpdateProductDto productDto)
        {
            var productFromDb = await _db.Products.FindAsync(id);

            if (productFromDb == null)
            {
                return NotFound("Produto não encontrado.");
            }

            // Atualiza as propriedades do produto encontrado com os dados do DTO
            productFromDb.Name = productDto.Name;
            productFromDb.Description = productDto.Description;
            productFromDb.Price = productDto.Price;
            productFromDb.IsPromotion = productDto.IsPromotion;
            productFromDb.CategoryId = productDto.CategoryId;

            await _db.SaveChangesAsync();

            return NoContent(); // Resposta padrão para um update bem-sucedido
        }

        // DELETE: api/products/5
        // Deleta um produto
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("Produto não encontrado.");
            }

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            return NoContent(); // Resposta padrão para um delete bem-sucedido
        }
    }
}