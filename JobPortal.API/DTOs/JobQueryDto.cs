namespace JobPortal.API.DTOs
{
    public class JobQueryDto
    {
        public string? City { get; set; }
        public string? Type { get; set; }          // EmploymentType
        public string? Keyword { get; set; }
        public bool? Remote { get; set; }

        // Pagination
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sorting (p.sh. createdAt, salaryMin, title)
        public string SortBy { get; set; } = "createdAt";
        public string SortDir { get; set; } = "desc"; // asc/desc
    }
}
