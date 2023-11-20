using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogArticleTag")]
    public class ArticleTag
    {
        public int Id { get; set; }
        public int? ArticleId { get; set; }
        public int? TagId { get; set; }

        public virtual Article? Article { get; set; }
        public virtual Tag? Tag { get; set; }
    }
}
