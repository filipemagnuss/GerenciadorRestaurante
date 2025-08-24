using backend.Models;

namespace backend.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = "Admin"
                });

                context.Users.Add(new User
                {
                    Username = "atendente",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = "Atendente"
                });

                context.SaveChanges();
            }
        }
    }
}
