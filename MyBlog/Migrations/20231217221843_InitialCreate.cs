using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace My_Blog.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MyBlogArticles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Views = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyBlogArticles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MyBlogTags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(225)", maxLength: 225, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyBlogTags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MyBlogArticleLikes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArticleId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyBlogArticleLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyBlogArticleLikes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MyBlogArticleLikes_MyBlogArticles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "MyBlogArticles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MyBlogComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArticleId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyBlogComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyBlogComments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MyBlogComments_MyBlogArticles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "MyBlogArticles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MyBlogArticleTag",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArticleId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyBlogArticleTag", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyBlogArticleTag_MyBlogArticles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "MyBlogArticles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MyBlogArticleTag_MyBlogTags_TagId",
                        column: x => x.TagId,
                        principalTable: "MyBlogTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyBlogArticleLikes_ArticleId",
                table: "MyBlogArticleLikes",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_MyBlogArticleLikes_UserId",
                table: "MyBlogArticleLikes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MyBlogArticleTag_ArticleId",
                table: "MyBlogArticleTag",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_MyBlogArticleTag_TagId",
                table: "MyBlogArticleTag",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_MyBlogComments_ArticleId",
                table: "MyBlogComments",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_MyBlogComments_UserId",
                table: "MyBlogComments",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyBlogArticleLikes");

            migrationBuilder.DropTable(
                name: "MyBlogArticleTag");

            migrationBuilder.DropTable(
                name: "MyBlogComments");

            migrationBuilder.DropTable(
                name: "MyBlogTags");

            migrationBuilder.DropTable(
                name: "MyBlogArticles");
        }
    }
}
