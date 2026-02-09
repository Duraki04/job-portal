using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class ApplyJobDto
    {
        // Optional: kandidati mund të shkruajë një cover letter
        [MaxLength(3000)]
        public string? CoverLetter { get; set; }

        // Optional: nëse do që aplikimi të ruajë CV specifike (snapshot)
        [MaxLength(500)]
        public string? CVUrlSnapshot { get; set; }
    }
}
