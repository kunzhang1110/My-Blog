using Newtonsoft.Json;

namespace MyBlog.Models.Articles
{
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
