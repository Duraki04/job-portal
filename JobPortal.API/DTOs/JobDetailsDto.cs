namespace JobPortal.API.DTOs
{
    public class JobDetailsDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;
        public bool IsRemote { get; set; }

        public string EmploymentType { get; set; } = string.Empty;

        public decimal SalaryMin { get; set; }
        public decimal SalaryMax { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }

        // Company info (detaje më të plota)
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyWebsite { get; set; }
        public string? CompanyCity { get; set; }
        public string? CompanyDescription { get; set; }
    }
}
