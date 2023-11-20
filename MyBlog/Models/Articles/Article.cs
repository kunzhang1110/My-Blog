using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogArticles")]
    public class Article
    {
        public Article()
        {
            ArticleTags = new HashSet<ArticleTag>();
        }

        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;

        public int? Views { get; set; }

        public virtual ICollection<ArticleTag> ArticleTags { get; set; }
    }
}
