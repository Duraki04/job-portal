namespace JobPortal.API.DTOs
{
    public class CompanyProfileDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string Description { get; set; } = string.Empty;

        // Owner user info (useful për frontend)
        public int UserId { get; set; }
        public string OwnerFullName { get; set; } = string.Empty;
        public string OwnerEmail { get; set; } = string.Empty;
    }
}
