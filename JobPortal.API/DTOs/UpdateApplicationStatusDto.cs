using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class UpdateApplicationStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
        // Allowed values: Pending, Shortlisted, Accepted, Rejected
    }
}
