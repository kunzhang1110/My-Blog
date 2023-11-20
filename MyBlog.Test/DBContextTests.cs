using My_Blog.Data;
using MyBlog.Models.Articles;

namespace MyBlog.Test
{
    public class DBContextTests
    {
        private const string connectionString = "Server=MY-THINKPAD;Database=MyBlog;Trusted_Connection=True;";

        private readonly ITestOutputHelper _output;
        private readonly MyBlogContext _context;

        public DBContextTests(ITestOutputHelper output)
        {
            _output = output;
            _context = new MyBlogContext(connectionString);
        }

        [Fact]
        public async Task Test1()
        {
            var articleDTO = new ArticleDto()
            {
                Date = DateTime.Now,
                Title = "ephemeral",
                Body = "ephemeral body",
                Tags = new List<Tag?>() { new Tag() { Name = "ephemeral1" }, new Tag() { Name = "ephemeral2" } }
            };

            var tagIds = new List<int?>();
            foreach (var tag in articleDTO.Tags)
            {
                if (tag == null) break;

                var tagInDB = await _context.Tags.Where(t => t.Name == tag.Name).FirstOrDefaultAsync();
                if (tagInDB == null)//a new tag
                {
                    _context.Tags.Add(tag);
                    await _context.SaveChangesAsync();
                    tagIds.Add(tag.Id);
                    _output.WriteLine(tag.Id.ToString());
                }
                else
                {
                    tagIds.Add(tagInDB.Id);
                }
            }

            var article = new Article()
            {
                Date = articleDTO.Date,
                Title = articleDTO.Title,
                Body = articleDTO.Body,
            };
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            foreach (var tagId in tagIds)
            {
                article.ArticleTags.Add(new ArticleTag() { ArticleId = article.Id, TagId = tagId });
            }
            await _context.SaveChangesAsync();
        }

        protected void printArtilcesWithTags(IList<ArticleDto> articleDTOs)
        {

            foreach (var article in articleDTOs)
            {
                _output.WriteLine(article.Title);
                foreach (var tag in article.Tags)
                {
                    if (tag != null)
                        _output.WriteLine(tag.Name);
                }
            }
        }
    }
}