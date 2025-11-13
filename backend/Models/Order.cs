using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty; 
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Recebido";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}