using JobPortal.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminAsync(AppDbContext db, IConfiguration config)
        {
            var adminEmail = config["SeedAdmin:Email"] ?? "admin@jobportal.com";
            var adminPass = config["SeedAdmin:Password"] ?? "Admin123!";

            var exists = await db.Users.AnyAsync(u => u.Email == adminEmail);
            if (exists) return;

            var admin = new User
            {
                FullName = "System Admin",
                Email = adminEmail.ToLowerInvariant(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPass),
                Role = UserRole.Admin
            };

            db.Users.Add(admin);
            await db.SaveChangesAsync();
        }
    }
}
