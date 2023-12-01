using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBlog.Models.Articles;
using My_Blog.Data;
using Microsoft.CodeAnalysis;
using System.Security.Claims;
using System.Threading.Tasks;
using MyBlog.Models.Account;
using My_Blog.Services;

namespace MyBlog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly MyBlogContext _context;

        public CommentsController(MyBlogContext context)
        {
            _context = context;
        }

        private ActionResult<Comment>? CheckUser(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) { return BadRequest(new ProblemDetails { Title = "Cannot find user id" }); }
            if (id != int.Parse(userId)) { return BadRequest(new ProblemDetails { Title = "User id does not match logged in user id" }); }
            return null;
        }

        private async Task<ActionResult<Comment>> UpdateComment(Comment? comment, CommentDto commentDto)
        {
            var checkUserResult = CheckUser(commentDto.Id);
            if (checkUserResult != null) return checkUserResult;

            if (comment != null)
            {
                comment.Body = commentDto.Body;
                comment.Date = DateTime.Now;
                _context.Entry(comment).State = EntityState.Modified;
            }
            else
            {
                comment = new Comment()
                {
                    Body = commentDto.Body,
                    ArticleId = commentDto.ArticleId,
                    UserId = commentDto.UserId,
                    Date = DateTime.Now,
                };
                _context.Comments.Add(comment);
            }
            var saveChangeResult = await _context.SaveChangesAsync();
            if (saveChangeResult > 0) return CreatedAtRoute("GetComment", new { comment.Id }, commentDto);
            return BadRequest(new ProblemDetails { Title = "Problem creating new comment" });
        }

        /// <summary>
        /// Get a comment by comment id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment?>> GetComment(int id)
        {
            return await _context.Comments.FindAsync(id);
        }


        [Authorize(Roles = "Member, Admin")]
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(CommentDto commentDto)
        {
            return await UpdateComment(null, commentDto);
        }

        [Authorize(Roles = "Member, Admin")]
        [HttpPut]
        public async Task<ActionResult<Comment>> PutComment(CommentDto commentDto)
        {
            var comment = await _context.Comments.FindAsync(commentDto.Id);
            if (comment == null) { return BadRequest(new ProblemDetails { Title = "Cannot find comment in db" }); }
            return await UpdateComment(comment, commentDto);
        }

        [Authorize(Roles = "Member, Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Comment>> DeleteArticle(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) { return NotFound(); }

            var result = CheckUser(comment.UserId);
            if (result != null) return result;


            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Get a list of comments for an article by article id
        /// </summary>
        [HttpGet("GetCommentsByAritcleId/{articleId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByAritcleId(int articleId)
        {
            return await _context.Comments.Where(comment => comment.ArticleId == articleId).ToListAsync();
        }

        /// <summary>
        /// Get a list of comments written by an user by user id
        /// </summary>
        [HttpGet("GetCommentsByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByUserId(int userId)
        {
            return await _context.Comments.Where(comment => comment.UserId == userId).ToListAsync();
        }

    }
}
