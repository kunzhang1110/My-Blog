using MyBlog.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogComments")]
    public class Comment: IContent
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public int UserId { get; set; }

        public DateTime? Date { get; set; }
        public string Body { get; set; } = null!;

        //navigation properties
        public User User { get; set; } = null!;
        public Article Article { get; set; } = null!;
    }
}
