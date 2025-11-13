using backend.Data;
using backend.DTOs; 
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }
        
        [AllowAnonymous]
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
                    Category = p.Category == null ? null : new CategoryDto
                    {
                        Id = p.Category.Id,
                        Name = p.Category.Name
                    }
                })
                .AsNoTracking()
                .ToListAsync();
        }

        [AllowAnonymous]
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

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateOrUpdateProductDto productDto)
        {
            var newProduct = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                CategoryId = productDto.CategoryId
            };

            _db.Products.Add(newProduct);
            await _db.SaveChangesAsync();
            
            var productResultDto = await GetProduct(newProduct.Id);

            return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, productResultDto.Value);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateOrUpdateProductDto productDto)
        {
        
            var productFromDb = await _db.Products.FindAsync(id);

            if (productFromDb == null)
            {
                return NotFound("Produto não encontrado.");
            }

            productFromDb.Name = productDto.Name;
            productFromDb.Description = productDto.Description;
            productFromDb.Price = productDto.Price;
            productFromDb.CategoryId = productDto.CategoryId;

            await _db.SaveChangesAsync();

            return NoContent(); 
        }

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

            return NoContent(); 
        }
    }
}