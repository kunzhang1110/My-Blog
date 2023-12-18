using System.ComponentModel.DataAnnotations;

namespace MyBlog.Models.Account
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "User Name is required")]
        public string UserName { get; set; } = null!;

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = null!;

    }
}
