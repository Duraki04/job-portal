namespace JobPortal.API.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string Description { get; set; } = string.Empty;

        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // One-to-Many with Jobs
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}