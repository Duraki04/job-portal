using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties (One-to-One)
        public Company? Company { get; set; }
        public Candidate? Candidate { get; set; }
    }
}