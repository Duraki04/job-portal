namespace JobPortal.API.DTOs
{
    public class JobApplicationDto
    {
        public int ApplicationId { get; set; }

        public DateTime AppliedAt { get; set; }
        public string Status { get; set; } = string.Empty;

        // Candidate info
        public int CandidateId { get; set; }
        public string CandidateFullName { get; set; } = string.Empty;
        public string? CandidateCity { get; set; }
        public string? ExperienceLevel { get; set; }
        public string? CVUrl { get; set; }

        public string? CoverLetter { get; set; }
    }
}
