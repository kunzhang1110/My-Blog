using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using MyBlog.Models.Account;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyBlog.Models.Articles
{
    [Table("MyBlogComments")]
    public class Comment
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public int UserId { get; set; }

        public DateTime? Date { get; set; }
        public string Body { get; set; } = null!;

        public virtual User User { get; set; } = null!;


        public virtual Article Article { get; set; } = null!;
    }
}
