using MyBlog.Controllers;

using Microsoft.Extensions.Logging;

using My_Blog.Data;
using My_Blog.Services;

namespace MyBlog.Test
{
    public class ArticleControllerTests
    {
        private readonly ITestOutputHelper _output;
        private readonly ILogger<ArticlesController> _logger;
        private readonly ArticlesController _controller;
        private readonly ImageService _imageService;

        public ArticleControllerTests(ITestOutputHelper output)
        {
            var mockContext = new Mock<MyBlogContext>(""); //empty connection string
            mockContext.Setup((context) => context.SaveChangesAsync(default)).Returns(Task.FromResult(1)).Verifiable();
            _output = output;
            _controller = new ArticlesController(mockContext.Object, _imageService);
        }

        [Fact]
        public void GetSummary_Test()
        {
            var body = "Equity Management System tracks your shares, trades, dividends and monitors the performance of your portfolio.\r\n\r\n## Input and Ouput";
            var summary = ArticlesController.GetSummary(body);
            _output.WriteLine($"summary is {summary}");
        }
    }
}