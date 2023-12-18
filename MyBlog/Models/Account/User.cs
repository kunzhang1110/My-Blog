using Microsoft.AspNetCore.Identity;
using My_Blog.Models.Articles;
using MyBlog.Models.Articles;

namespace MyBlog.Models.Account
{
    public class User : IdentityUser<int>
    {
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public virtual ICollection<ArticleLike> ArticleLikes { get; set; } = new HashSet<ArticleLike>();
    }
}
