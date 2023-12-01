using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogArticles")]
    public class Article
    {

        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int? Views { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public virtual ICollection<ArticleTag> ArticleTags { get; set; } = new HashSet<ArticleTag>();


    }
}
