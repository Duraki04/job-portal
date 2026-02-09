namespace JobPortal.API.Entities
{
    public class Application
    {
        public int Id { get; set; }

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        // ✅ e dobishme kur Employer ndryshon statusin
        public DateTime? UpdatedAt { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

        // ✅ “real”: kandidati mund të shtojë cover letter
        public string? CoverLetter { get; set; }

        // ✅ “real”: ruaj CV link në momentin e aplikimit (snapshot),
        // që edhe nëse kandidati e ndërron CV më vonë, aplikimi e ka të vetin
        public string? CVUrlSnapshot { get; set; }

        // Relationships
        public int JobId { get; set; }
        public Job Job { get; set; } = null!;

        public int CandidateId { get; set; }
        public Candidate Candidate { get; set; } = null!;
    }
}
