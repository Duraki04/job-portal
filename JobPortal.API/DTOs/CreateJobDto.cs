using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class CreateJobDto
    {
        [Required]
        [MaxLength(120)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(80)]
        public string City { get; set; } = string.Empty;

        public bool IsRemote { get; set; }

        [Required]
        [MaxLength(40)]
        public string EmploymentType { get; set; } = "Full-Time"; // Full-Time, Part-Time

        [Range(0, double.MaxValue)]
        public decimal SalaryMin { get; set; }

        [Range(0, double.MaxValue)]
        public decimal SalaryMax { get; set; }

        // opsionale: nëse s'e dërgon, API vendos default
        public DateTime? ExpiresAt { get; set; }
    }
}

