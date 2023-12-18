using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBlog.Models.Articles;
using My_Blog.Data;
using Microsoft.CodeAnalysis;
using System.Security.Claims;
using My_Blog.Models.Articles;
using My_Blog.Utils;
using Microsoft.AspNetCore.Identity;
using MyBlog.Models.Account;

namespace MyBlog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly MyBlogContext _context;
        private readonly UserManager<User> _userManager;
        public CommentsController(MyBlogContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private ActionResult<CommentDto>? CheckUser(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) { return BadRequest(new ProblemDetails { Title = "Cannot find user id" }); }
            if (id != int.Parse(userId)) { return BadRequest(new ProblemDetails { Title = "User id does not match logged in user id" }); }
            return null;
        }

        private async Task<ActionResult<CommentDto>> UpdateComment(Comment? comment, CommentDto commentDto)
        {


            var checkUserResult = CheckUser(commentDto.UserId);
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
            if (saveChangeResult > 0) return CreatedAtRoute("GetComment", new { comment.Id }, comment.ToCommentDto());
            return BadRequest(new ProblemDetails { Title = "Problem creating new comment" });
        }

        /// <summary>
        /// Get a comment by comment id
        /// </summary>
        [HttpGet("{id}", Name = "GetComment")]
        public async Task<ActionResult<CommentDto?>> GetComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            return comment == null ? NotFound() : Ok(comment);
        }


        [Authorize(Roles = "Member, Admin")]
        [HttpPost]
        public async Task<ActionResult<CommentDto>> PostComment(CommentDto commentDto)
        {
            return await UpdateComment(null, commentDto);
        }

        [Authorize(Roles = "Member, Admin")]
        [HttpPut]
        public async Task<ActionResult<CommentDto>> PutComment(CommentDto commentDto)
        {
            var comment = await _context.Comments.FindAsync(commentDto.Id);
            if (comment == null) { return BadRequest(new ProblemDetails { Title = "Cannot find comment in db" }); }
            return await UpdateComment(comment, commentDto);
        }

        [Authorize(Roles = "Member, Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<CommentDto>> DeleteArticle(int id)
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
        [HttpGet("GetCommentsByArticleId/{articleId}")]
        public async Task<ActionResult<List<CommentDto>>> GetCommentsByArticleId(int articleId, [FromQuery] PageParams pageParams)
        {
            var query = _context.Comments
              .Where(comment => comment.ArticleId == articleId)
              .SortByDate(pageParams.OrderBy)
              .AsQueryable();

            var comments = await PagedList<Comment>.ToPagedList(query, pageParams.PageNumber, pageParams.PageSize);

            var commentDtos = new List<CommentDto>();
            if (comments != null)
            {
                foreach (var comment in comments)
                {
                    var user = await _userManager.FindByIdAsync(comment.UserId.ToString());
                    commentDtos.Add(comment.ToCommentDto(user.UserName));
                }

                Response.AddPaginationHeader(comments.PaginationData);
            }

            return Ok(commentDtos);
        }


        /// <summary>
        /// Get a list of comments written by an user by user id
        /// </summary>
        [HttpGet("GetCommentsByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByUserId(int userId)
        {
            var comments = await _context.Comments.Where(comment => comment.UserId == userId).ToListAsync();
            return comments == null ? NotFound() : Ok(comments);
        }


    }
}
