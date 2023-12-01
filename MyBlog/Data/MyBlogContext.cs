﻿using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using MyBlog.Models.Articles;
using MyBlog.Models.Account;

namespace My_Blog.Data
{
    public class MyBlogContext : IdentityDbContext<User, Role, int>
    {

        private readonly string _connectionString = "";
        public MyBlogContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public MyBlogContext(DbContextOptions<MyBlogContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public virtual DbSet<Article> Articles { get; set; } = null!;
        public virtual DbSet<Tag> Tags { get; set; } = null!;
        public virtual DbSet<ArticleTag> ArticleTags { get; set; } = null!;
        public virtual DbSet<Comment> Comments { get; set; } = null!;
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Article>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("datetime");

            });

            builder.Entity<Tag>(entity =>
            {
                entity.Property(e => e.Name)
                    .HasMaxLength(225);
            });

            builder.Entity<ArticleTag>(entity =>
            {
                entity.ToTable("MyBlogArticleTag");

                entity.HasOne(articleTag => articleTag.Article)
                    .WithMany(article => article.ArticleTags)
                    .HasForeignKey(articleTag => articleTag.ArticleId)
                    .OnDelete(DeleteBehavior.Cascade);//delete articleTag will deleting article but not tag

                entity.HasOne(articleTag => articleTag.Tag)
                    .WithMany(tag => tag.ArticleTags)
                    .HasForeignKey(d => d.TagId);
            });

            builder.Entity<Comment>(entity =>
            {
                entity.ToTable("MyBlogComments");

                entity.HasOne(comment => comment.Article)
                    .WithMany(article => article.Comments)
                    .HasForeignKey(comment => comment.ArticleId)
                    .IsRequired();


                entity.HasOne(comment => comment.User)
                    .WithMany(user => user.Comments)
                    .HasForeignKey(comment => comment.UserId)
                    .IsRequired();
            });


            // exclude Idenetity tables in migrations
            builder.Entity<User>().ToTable("AspNetUsers", t => t.ExcludeFromMigrations());
            builder.Entity<Role>().ToTable("AspNetRoles", t => t.ExcludeFromMigrations());
            builder.Entity<IdentityUserClaim<int>>().ToTable("AspNetUserClaims", t => t.ExcludeFromMigrations());
            builder.Entity<IdentityRoleClaim<int>>().ToTable("AspNetRoleClaims", t => t.ExcludeFromMigrations());
            builder.Entity<IdentityUserLogin<int>>().ToTable("AspNetUserLogins", t => t.ExcludeFromMigrations());
            builder.Entity<IdentityUserRole<int>>().ToTable("AspNetUserRoles", t => t.ExcludeFromMigrations());
            builder.Entity<IdentityUserToken<int>>().ToTable("AspNetUserTokens", t => t.ExcludeFromMigrations());
        }
    }
}
