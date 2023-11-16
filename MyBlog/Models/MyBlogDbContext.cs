using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using MyBlog.Models.Articles;
using MyBlog.Models.Security;

namespace MyBlog.Models
{
    public class MyBlogDbContext : IdentityDbContext<ApplicationUser>
    {

        private readonly string _connectionString = "";
        public MyBlogDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public MyBlogDbContext(DbContextOptions<MyBlogDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public virtual DbSet<Article> Articles { get; set; } = null!;
        public virtual DbSet<Tag> Tags { get; set; } = null!;
        public virtual DbSet<ArticleTag> ArticleTags { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Article>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("datetime");

            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.Property(e => e.Name)
                    .HasMaxLength(225);
            });

            modelBuilder.Entity<ArticleTag>(entity =>
            {
                entity.ToTable("ArticleTag");

                entity.HasOne(articleTag => articleTag.Article)
                    .WithMany(article => article.ArticleTags)
                    .HasForeignKey(articleTag => articleTag.ArticleId)
                    .OnDelete(DeleteBehavior.Cascade);//delete cascade on deleting article but not tag

                entity.HasOne(d => d.Tag)
                    .WithMany(p => p.ArticleTags)
                    .HasForeignKey(d => d.TagId);
            });


        }
    }
}
