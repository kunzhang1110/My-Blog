using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{

    [Table("MyBlogTags")]
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        [JsonIgnore]
        public ICollection<ArticleTag> ArticleTags { get; set; } = new HashSet<ArticleTag>();
    }
}
