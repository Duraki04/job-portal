namespace JobPortal.API.Entities
{
	public class Candidate
	{
		public int Id { get; set; }
		public string City { get; set; } = string.Empty;
		public string? Bio { get; set; }
		public string ExperienceLevel { get; set; } = string.Empty; // e.g., Junior, Senior
		public string? CVUrl { get; set; } // Path to PDF file
		public string? Phone { get; set; }

		// Foreign Key
		public int UserId { get; set; }
		public User User { get; set; } = null!;

		// Relationships
		public ICollection<Application> Applications { get; set; } = new List<Application>();
		public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
	}
}