using My_Blog.Models.Articles;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogArticles")]
    public class Article : IContent
    {

        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int? Views { get; set; }

        //navigation properties
        public ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public ICollection<ArticleLike> ArticleLikes { get; set; } = new HashSet<ArticleLike>();
        public ICollection<ArticleTag> ArticleTags { get; set; } = new HashSet<ArticleTag>();
    }
}
