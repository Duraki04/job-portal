namespace JobPortal.API.DTOs
{
    public class CandidateProfileDto
    {
        public int Id { get; set; }

        public string City { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string ExperienceLevel { get; set; } = string.Empty;

        public string? CVUrl { get; set; }
        public string? Phone { get; set; }

        // Owner user info (useful për frontend)
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
