using System.ComponentModel.DataAnnotations;

namespace MyBlog.Models.Account
{
    public class LoginDto
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
