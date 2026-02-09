using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class UpdateCompanyProfileDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(120)]
        public string Industry { get; set; } = string.Empty;

        [MaxLength(120)]
        public string City { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Website { get; set; }

        [MaxLength(4000)]
        public string Description { get; set; } = string.Empty;
    }
}
