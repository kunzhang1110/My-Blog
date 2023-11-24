namespace My_Blog.Models.Articles
{
    public class ArticleParams
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 5;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
        public string? OrderBy { get; set; }
        public string? CategoryName { get; set; }

        public int PageNumber { get; set; } = 1;

    }
}
