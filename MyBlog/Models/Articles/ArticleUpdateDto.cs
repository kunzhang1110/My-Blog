namespace MyBlog.Models.Articles
{
    public partial class ArticleUpdateDto
    {
        public int Id { get; set; }
        public string? Date { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int? Viewed { get; set; }
        public string? Tags { get; set; }

    }
}
