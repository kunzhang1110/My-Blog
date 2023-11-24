using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using My_Blog.Data;
using MyBlog.Controllers;
using System.Web;

namespace My_Blog.Services
{
    public class ImageService
    {
        private readonly string _imageDirectory;

        public ImageService()
        {
            _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserData");
        }

        /// <summary>
        /// Get a list of images urls in aritlceId directory.
        /// </summary>
        public List<string> GetImagesUrls(int articleId)
        {
            var directoryPath = Path.Combine(_imageDirectory, articleId.ToString());
            var imageUrls = new List<string>();
            if (Directory.Exists(directoryPath))
                imageUrls = Directory.GetFiles(directoryPath).Select(f => Path.GetFileName(f)).ToList(); // get file names
            return imageUrls;
        }

        /// <summary>
        /// Add new images or replace images with the same name. Delete unsued images.
        /// </summary>
        public async Task AddOrUpdateImages(List<IFormFile> files, int articleId)
        {

            string directoryPath = Path.Combine(_imageDirectory, articleId.ToString());
            Directory.CreateDirectory(directoryPath);

            var existingFilePaths = Directory.GetFiles(directoryPath).ToList();

            foreach (var formFile in files)
            {
                string filePath = Path.Combine(directoryPath, formFile.FileName.Replace(" ", string.Empty));
                if (existingFilePaths.Contains(filePath)) { existingFilePaths.Remove(filePath); }

                if (formFile.Length > 0)
                {
                    using var fileStream = File.Create(filePath);
                    await formFile.CopyToAsync(fileStream);
                }
            }

            foreach (var path in existingFilePaths) //delete unused existing files
            {
                File.Delete(path);
            }

            if (Directory.GetFiles(directoryPath).ToList().Count == 0) Directory.Delete(directoryPath, true);
        }

        /// <summary>
        /// Delete existing image directory.
        /// </summary>
        public async Task DeleteImageDirectory(int articleId)
        {
            string directoryPath = Path.Combine(_imageDirectory, articleId.ToString());

            if (Directory.Exists(directoryPath))
            {
                try
                {
                    await Task.Run(() => Directory.Delete(directoryPath, true));
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deleting directory: {ex.Message}");
                }
            }
        }
    }
}
