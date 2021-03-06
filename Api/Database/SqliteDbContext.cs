using Api.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Database
{
    public class SqliteDbContext : DbContext
    {
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Subscriber> Subscribers { get; set; }
        public DbSet<User> Users { get; set; }

        public static SqliteDbContext Create()
            => new();

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source=Database.db");
    }
}
