using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class UpdateCandidateProfileDto
    {
        [MaxLength(120)]
        public string City { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Bio { get; set; }

        [MaxLength(50)]
        public string ExperienceLevel { get; set; } = string.Empty;
        // Suggested values: Junior, Mid, Senior

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? CVUrl { get; set; }
    }
}
