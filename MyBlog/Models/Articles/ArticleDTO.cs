namespace MyBlog.Models.Articles
{
    public class ArticleDto
    {
        public ArticleDto()
        {
            Tags = new HashSet<Tag?>();
        }

        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int? Views { get; set; }

        public IEnumerable<string>? ImageUrls { get; set; }

        public virtual ICollection<Tag?> Tags { get; set; }
    }
}
