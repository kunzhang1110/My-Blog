using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using MyBlog.Models.Articles;
using MyBlog.Models.Security;
using My_Blog.Data;
using My_Blog.Services;

namespace MyBlog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly MyBlogContext _context;
        private readonly ILogger _logger;
        private readonly string _imageDirectory;
        private readonly ImageService _imageService;


        public ArticlesController(MyBlogContext context, ImageService imageService, ILogger<ArticlesController> logger)
        {
            _context = context;
            _logger = logger;
            _imageService = imageService;
            _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserData");
        }




        /// <summary>
        /// Get summary (anything before the first ## in a markdown file) of an article.
        /// </summary>
        public static string GetSummary(string body)
        {
            var pattern = @"^([\W\w]*?)##"; //match anything before the first ##
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

        /// <summary>
        /// Get a list of of article summaries.
        /// </summary>
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

            var imageUrls = _imageService.GetImagesUrls(id);

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


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> PostArticle([FromForm] UpdateArticleDto request, [FromForm] List<IFormFile> files)
        {
            var article = await UpdateArticle(null, request);
            await _imageService.AddOrUpdateImages(files, article.Id);
            return CreatedAtAction("GetArticle", new { id = article.Id }, article);
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticle([FromRoute] int id, [FromForm] UpdateArticleDto request, [FromForm] List<IFormFile> files)
        {

            var article = await _context.Articles.Include(a => a.ArticleTags).Where(at => at.Id == id).FirstOrDefaultAsync();

            if (article != null)
            {
                await UpdateArticle(article, request);
                await _imageService.AddOrUpdateImages(files, id);
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();

            await _imageService.DeleteImageDirectory(article.Id);

            //delete redundant tags
            var tags = _context.Tags.Include(t => t.ArticleTags).ToList();
            foreach (var tag in tags)
            {
                if (tag.ArticleTags.Count == 0) // if the tag is not used by other articles
                    _context.Tags.Remove(tag);
            }

            _context.Articles.Remove(article);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
