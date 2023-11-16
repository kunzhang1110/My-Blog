using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using MyBlog.Models;
using MyBlog.Models.Articles;
using MyBlog.Models.Security;

namespace MyBlog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly MyBlogDbContext _context;
        private readonly ILogger _logger;
        private readonly string _imageDirectory;


        public ArticlesController(MyBlogDbContext context, ILogger<ArticlesController> logger)
        {
            _context = context;
            _logger = logger;
            _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserData");
        }

        private async Task DeleteRedundantTags()
        {

            var tags = _context.Tags.Include(t => t.ArticleTags).ToList();
            foreach (var tag in tags)
            {
                if (tag.ArticleTags.Count == 0)
                    _context.Tags.Remove(tag);
            }
            await _context.SaveChangesAsync();
        }

        // Get an article's summary
        public static string GetSummary(string body)
        {
            var pattern = @"^([\W\w]*?)##"; //match anything before the first ## in md
            var match = Regex.Match(body, pattern);
            return match.Groups[1].Value; //return the 1st group
        }

        // Add tags to DB if new and return a list of Tag Ids
        private async Task<ICollection<int?>> GetTagIdsAsync(ICollection<Tag?> tags)
        {
            var tagIds = new List<int?>();
            foreach (var tag in tags)
            {
                if (tag == null) break;

                var tagInDb = await _context.Tags.Where(t => t.Name == tag.Name).FirstOrDefaultAsync();
                if (tagInDb == null)//a new tag
                {
                    _context.Tags.Add(tag);
                    await _context.SaveChangesAsync();
                    tagIds.Add(tag.Id);
                }
                else
                {
                    tagIds.Add(tagInDb.Id);
                }
            }
            return tagIds;
        }

        private async Task<Article> UpdateArticle(Article? article, UpdateArticleDto request)
        {
            if (article != null)
            {
                article.Body = request.Body;
                article.Title = request.Title;
                article.Views = request.Viewed;
            }
            else
            {
                article = new Article()
                {
                    Date = DateTime.Now,
                    Title = request.Title,
                    Body = request.Body,
                    Views = request.Viewed,
                };
                _context.Articles.Add(article);
                await _context.SaveChangesAsync();
            }

            List<Tag?> tags = JsonConvert.DeserializeObject<List<Tag>>(request.Tags!)!;
            var tagIds = await GetTagIdsAsync(tags);
            article.ArticleTags.Clear();    //delete existing tags
            foreach (var tagId in tagIds)   //add articleTag to DB
            {
                article!.ArticleTags.Add(new ArticleTag() { ArticleId = article.Id, TagId = tagId });
            }
            _context.Entry(article).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return article;
        }

        private async Task UpdateImages(List<IFormFile> files, int id)
        {

            string directoryPath = Path.Combine(_imageDirectory, id.ToString());
            if (Directory.Exists(directoryPath)) Directory.Delete(directoryPath, true); //delete existing directory
            Directory.CreateDirectory(directoryPath);

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    string filePath = Path.Combine(directoryPath, formFile.FileName);
                    using var fileStream = System.IO.File.Create(filePath);
                    await formFile.CopyToAsync(fileStream);
                }
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles()
        {
            var articleSummaryDtos = new List<ArticleDto>();
            var articles = await _context.Articles
                .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
                .ToListAsync();

            foreach (var article in articles)
            {
                articleSummaryDtos.Add(
                    new ArticleDto
                    {
                        Id = article.Id,
                        Date = article.Date,
                        Title = article.Title,
                        Body = GetSummary(article.Body),
                        Views = article.Views,
                        Tags = article.ArticleTags.Select(at => at.Tag).ToList(),
                        ImageUrls = new List<string>()
                    });
            }

            return articleSummaryDtos;
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.Id == id).FirstOrDefaultAsync();

            if (article == null)
            {
                return NotFound();
            }

            // Add one view
            article.Views++;
            _context.Entry(article).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Get images
            var directoryPath = Path.Combine(_imageDirectory, id.ToString());
            var imageUrls = new List<string>();
            if (Directory.Exists(directoryPath))
            {
                var fileUrls = Directory.GetFiles(directoryPath);
                if (fileUrls.Length == 0)
                {//delete empty directory
                    Directory.Delete(directoryPath, true);
                }
                else
                {
                    imageUrls = fileUrls.Select(f => Path.GetFileName(f)).ToList(); // get file names
                }
            }

            return new ArticleDto()
            {
                Id = article.Id,
                Date = article.Date,
                Title = article.Title,
                Body = article.Body,
                Views = article.Views,
                Tags = article.ArticleTags.Select(at => at.Tag).ToList(),
                ImageUrls = imageUrls.Count > 0 ? imageUrls : null
            };
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        public async Task<IActionResult> PostArticle([FromForm] UpdateArticleDto request, [FromForm] List<IFormFile> files)
        {
            var article = await UpdateArticle(null, request);
            await UpdateImages(files, article.Id);
            return CreatedAtAction("GetArticle", new { id = article.Id }, article);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticle([FromRoute] int id, [FromForm] UpdateArticleDto request, [FromForm] List<IFormFile> files)
        {

            var article = await _context.Articles.Include(a => a.ArticleTags).Where(at => at.Id == id).FirstOrDefaultAsync();

            if (article != null)
            {
                await UpdateArticle(article, request);
                await UpdateImages(files, id);
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }
            await UpdateImages(new List<IFormFile>(), article.Id);
            await DeleteRedundantTags();
            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
