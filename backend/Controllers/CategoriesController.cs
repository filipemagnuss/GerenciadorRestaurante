using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoriesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _db.Categories.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _db.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        public class CreateCategoryDto
        {
            public string Name { get; set; }  = default!;
        }

        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] CreateCategoryDto categoryDto)
        {
            if (string.IsNullOrWhiteSpace(categoryDto.Name))
            {
                return BadRequest("O nome da categoria é obrigatório.");
            }

            var newCategory = new Category { Name = categoryDto.Name };

            _db.Categories.Add(newCategory);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
        }
    }
}