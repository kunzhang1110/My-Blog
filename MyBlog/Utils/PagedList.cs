using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using MyBlog.Models.Articles;

namespace My_Blog.Utils
{
    public class PagedList<T> : List<T>

    {
        public PaginationData PaginationData { get; set; }

        public PagedList(List<T> items, int totalCount, int pageNumber, int pageSize, int totalPages)
        {


            PaginationData = new()
            {
                TotalCount = totalCount,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = totalPages
            };
            AddRange(items);
        }

        public static async Task<PagedList<T>?> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var totalCount = await query.CountAsync();
            if (totalCount == 0) return null;
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            var currentPage = pageNumber < totalPages ? pageNumber : totalPages;
            var items = await query.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, totalCount, currentPage, pageSize, totalPages);

        }

    }
}
