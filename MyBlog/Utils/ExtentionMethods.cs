using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis;
using My_Blog.Models.Articles;
using MyBlog.Models.Articles;

namespace My_Blog.Utils
{
    public static class ExtentionMethods
    {

        /// <summary>
        /// Get the summary (anything before the first ## in a markdown file) of an article.
        /// </summary>
        public static string GetSummary(string body)
        {
            var match = Regex.Match(body, @"^([\W\w]*?)##"); //match anything before the first ##
            return match.Groups[1].Value; //return the 1st group
        }


        /// <summary>
        /// Convert Article to ArticleDTO. If shouldGetSummary is true, the body of the article is a summary.
        /// </summary>
        /// <param name="shouldGetSummary">If true, the body of the article is a summary. Default false</param>
        public static ArticleDto ToAritcleDto(this Article article, List<string>? imageUrls, int? userId, bool shouldGetSummary = false)
        {
            var temp = article.ArticleLikes.Any(articleLike => articleLike.UserId == userId);
            return new ArticleDto()
            {
                Id = article.Id,
                Date = article.Date,
                Title = article.Title,
                Body = shouldGetSummary ? GetSummary(article.Body) : article.Body,
                Views = article.Views ?? 0,
                Tags = article.ArticleTags.Select(at => at.Tag).ToList(),
                ImageUrls = imageUrls?.Count > 0 ? imageUrls : null,
                NumberOfLikes = article.ArticleLikes.Count,
                IsLikedByUser = userId != null && article.ArticleLikes.Any(articleLike => articleLike.UserId == userId)
            };
        }

        public static CommentDto ToCommentDto(this Comment comment, string? username = null)
        {
            return new CommentDto()
            {
                Id = comment.Id,
                ArticleId = comment.ArticleId,
                UserId = comment.UserId,
                UserName = username,
                Date = comment.Date.ToString(),
                Body = comment.Body,
            };
        }

        public static IQueryable<T> SortByDate<T>(this IQueryable<T> query, string? orderBy) where T : IContent
        {
            if (!string.IsNullOrEmpty(orderBy)) //order results by date
            {
                query = orderBy switch
                {
                    "dateAsc" => query.OrderBy(a => a.Date),
                    "dateDesc" => query.OrderByDescending(p => p.Date),
                    _ => query.OrderBy(a => a.Date)
                };
            }
            return query;
        }


        public static IQueryable<Article> FilterCategory(this IQueryable<Article> query, string? category)
        {
            if (!string.IsNullOrEmpty(category)) //filter results by category
            {
                query = query.Where(a => a.ArticleTags.Any(at => at.Tag != null && at.Tag.Name == category));
            }
            return query;
        }

        public static void AddPaginationHeader(this HttpResponse response, PaginationData paginationData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationData, options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); //expose header to cross-domain client
        }


    }
}