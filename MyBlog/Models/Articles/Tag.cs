using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{

    [Table("MyBlogTags")]
    public class Tag
    {
        public Tag()
        {
            ArticleTags = new HashSet<ArticleTag>();
        }

        public int? Id { get; set; }
        public string? Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<ArticleTag> ArticleTags { get; set; }
    }
}
