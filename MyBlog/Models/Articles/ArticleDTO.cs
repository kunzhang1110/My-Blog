namespace MyBlog.Models.Articles
{
    public class ArticleDto
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int Views { get; set; }
        public int NumberOfLikes { get; set; }
        public int NumberOfComments { get; set; }
        public bool IsLikedByUser { get; set; } = false;
        public IEnumerable<string>? ImageUrls { get; set; }
        public ICollection<Tag>? Tags { get; set; } = new HashSet<Tag>();
    }
}
