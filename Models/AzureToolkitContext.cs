using Microsoft.EntityFrameworkCore;

namespace azuretoolkit.Models
{
    public class AzureToolkitContext : DbContext
    {
        public AzureToolkitContext (DbContextOptions<AzureToolkitContext> options) : base (options) { }

        public DbSet<SavedImage> SavedImages { get; set; }

        public DbSet<SavedImageTag> SavedImageTags { get; set; }
    }
}