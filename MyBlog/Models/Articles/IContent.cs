using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models.Articles
{

    public interface IContent
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }

        public string Body { get; set; }

    }
}
