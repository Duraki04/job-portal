namespace JobPortal.API.Entities
{
    public class Job
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public bool IsRemote { get; set; }

        public string EmploymentType { get; set; } = "Full-Time"; // Full-Time, Part-Time
        public decimal SalaryMin { get; set; }
        public decimal SalaryMax { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ✅ Fix: e bëjmë nullable + vendosim default në Create
        public DateTime? ExpiresAt { get; set; }

        // Relationship
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
