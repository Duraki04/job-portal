namespace JobPortal.API.DTOs
{
    public class MyApplicationDto
    {
        public int ApplicationId { get; set; }

        public DateTime AppliedAt { get; set; }
        public string Status { get; set; } = string.Empty;

        // Job info
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string JobCity { get; set; } = string.Empty;
        public bool IsRemote { get; set; }

        // Company info
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
    }
}
