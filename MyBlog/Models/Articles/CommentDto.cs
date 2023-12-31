﻿
namespace MyBlog.Models.Articles
{

    public class CommentDto
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public int UserId { get; set; }

        public string? UserName { get; set; } = null!;
        public string? Date { get; set; }
        public string Body { get; set; } = null!;

    }
}
