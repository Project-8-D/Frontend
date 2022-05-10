using Api.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Database
{
    public class SqliteDbContext : DbContext
    {
        public DbSet<Test> Test { get; set; }
        // After creating the model classes and table properties, enter the following in Package Manager Console:
        // add-migration Initial
        // update-database

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source=Database.db");
    }
}
