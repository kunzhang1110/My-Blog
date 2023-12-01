using Microsoft.AspNetCore.Identity;
using MyBlog.Models.Articles;

namespace MyBlog.Models.Account
{
    public class User : IdentityUser<int>
    {
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
    }
}
