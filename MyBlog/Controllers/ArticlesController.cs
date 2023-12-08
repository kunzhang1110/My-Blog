using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using MyBlog.Models.Articles;
using My_Blog.Data;
using My_Blog.Services;
using My_Blog.Models.Articles;
using My_Blog.Utils;
using Microsoft.CodeAnalysis;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace MyBlog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly MyBlogContext _context;
        private readonly ImageService _imageService;

        public ArticlesController(MyBlogContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
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

        private async Task<Article> UpdateArticle(Article? article, ArticleUpdateDto request, List<IFormFile> files)
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
            await _imageService.AddOrUpdateImagesAsync(files, article.Id);

            return article;
        }

        /// <summary>
        /// Get a list of of article summaries.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles([FromQuery] PageParams pageParams)
        {
            var articleSummaryDtos = new List<ArticleDto>();

            var query = _context.Articles
                .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
                .SortByDate(pageParams.OrderBy)
                .FilterCategory(pageParams.CategoryName);

            var articles = await PagedList<Article>.ToPagedList(query, pageParams.PageNumber, pageParams.PageSize);

            if (articles.Count == 0) return BadRequest();

            foreach (var article in articles)
            {
                articleSummaryDtos.Add(
                  article.ToAritcleDto(null, true));
            }

            Response.AddPaginationHeader(articles.PaginationData);
            return Ok(articleSummaryDtos);
        }

        /// <summary>
        /// Get an article by Id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.Id == id).FirstOrDefaultAsync();

            if (article == null) return NotFound();

            // Add one view
            article.Views++;
            _context.Entry(article).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var imageUrls = _imageService.GetImagesUrls(id);

            return article.ToAritcleDto(imageUrls, false);
        }

        /// <summary>
        /// Get n tags order by number of usages by articles
        /// </summary>

        [HttpGet("Categories")]
        public async Task<ActionResult<IEnumerable<Tag?>>> GetCategories()
        {
            return await _context.ArticleTags
                .GroupBy(at => at.TagId)
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Select(g => _context.Tags.SingleOrDefault(t => t.Id == g.Id))
                .ToListAsync();
        }

        /// <summary>
        /// Get a list of articles that are commented by user with user id
        /// </summary>
        [HttpGet("GetArticlesByUserCommented/{userId}")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticlesByUserCommented(int userId, [FromQuery] PageParams pageParams)
        {
            var articleDtos = new List<ArticleDto>();

            var articleIds = await _context
                .Comments
                .Where(comment => comment.UserId == userId)
                .GroupBy(c => c.ArticleId).Select(c => c.Key)
                .ToListAsync();

            var query = _context.Articles
                .Where(a => articleIds.Contains(a.Id))
                .AsQueryable();

            var articles = await PagedList<Article>.ToPagedList(query, pageParams.PageNumber, pageParams.PageSize);


            if (articles.Count == 0) return BadRequest();

            foreach (var article in articles)
            {
                articleDtos.Add(
                  article.ToAritcleDto(null, true));
            }

            Response.AddPaginationHeader(articles.PaginationData);
            return Ok(articleDtos);


        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Article>> PostArticle([FromForm] ArticleUpdateDto request, [FromForm] List<IFormFile> files)
        {
            try
            {
                var article = await UpdateArticle(null, request, files);
                return CreatedAtAction("GetArticle", new { id = article.Id }, article);
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails { Title = ex.Message });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Article>> PutArticle([FromRoute] int id, [FromForm] ArticleUpdateDto request, [FromForm] List<IFormFile> files)
        {

            var article = await _context.Articles.Include(a => a.ArticleTags).Where(at => at.Id == id).FirstOrDefaultAsync();

            if (article == null) return NotFound();
            try
            {
                await UpdateArticle(article, request, files);
                return Ok(article);
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails { Title = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();

            try
            {
                await _imageService.DeleteImageDirectory(article.Id);

                //delete redundant tags
                await _context.Tags.Include(t => t.ArticleTags).ForEachAsync(tag =>
                {
                    if (tag.ArticleTags.Count == 0) // if the tag is not used by other articles
                        _context.Tags.Remove(tag);
                });

                _context.Articles.Remove(article);

                var result = await _context.SaveChangesAsync();

                if (result > 0) return Ok();
                return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails { Title = ex.Message });
            }
        }
    }
}
