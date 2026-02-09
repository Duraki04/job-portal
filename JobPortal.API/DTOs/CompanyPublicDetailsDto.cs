namespace JobPortal.API.DTOs
{
    public class CompanyPublicDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string City { get; set; } = "";
        public string Industry { get; set; } = "";
        public string Description { get; set; } = "";

        public List<CompanyJobItemDto> Jobs { get; set; } = new();
    }

    public class CompanyJobItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string City { get; set; } = "";
        public bool IsRemote { get; set; }
    }
}
