using Microsoft.AspNetCore.Identity;

namespace MyBlog.Models.Account
{
    public class User : IdentityUser<int>
    {
        //IdentityUser defines properties like Email, Username, etc.
    }
}
