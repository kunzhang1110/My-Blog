using MyBlog.Models.Account;
using MyBlog.Models.Articles;


namespace My_Blog.Models.Articles
{
    public class ArticleLike
    {

        public int Id { get; set; }


        public int ArticleId { get; set; }

        public int UserId { get; set; }

        //navigation properties
        public Article Article { get; set; } = null!;
        public User User { get; set; } = null!;

    }
}
