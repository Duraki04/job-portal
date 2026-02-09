namespace JobPortal.API.Common
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = Array.Empty<T>();

        public int Page { get; set; }
        public int PageSize { get; set; }

        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public bool HasPrevious => Page > 1;
        public bool HasNext => Page < TotalPages;

        public static PagedResult<T> Create(IEnumerable<T> items, int totalItems, int page, int pageSize)
        {
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return new PagedResult<T>
            {
                Items = items,
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }
    }
}
