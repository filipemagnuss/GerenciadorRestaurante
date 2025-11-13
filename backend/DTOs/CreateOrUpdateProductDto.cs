namespace backend.DTOs
{
    public class CreateOrUpdateProductDto
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }
}