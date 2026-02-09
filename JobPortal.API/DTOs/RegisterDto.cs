using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(120)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(180)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [MaxLength(100)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Candidate"; // Employer/Candidate/Admin
    }
}
