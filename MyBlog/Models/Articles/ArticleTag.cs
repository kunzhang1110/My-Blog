using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogArticleTag")]
    public class ArticleTag
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public int TagId { get; set; }

        //navigation properties
        public Article Article { get; set; } = null!;
        public Tag Tag { get; set; } = null!;
    }
}
