using Api.Database;
using Api.Database.Models;

namespace Api.Services
{
    public class DatabaseService
    {
        public async Task AddNotificationAsync(Notification? notification)
        {
            if (notification == null)
                return;

            var context = SqliteDbContext.Create();

            context.Notifications.Add(notification);
            await context.SaveChangesAsync();
        }

        public IEnumerable<Notification> GetNotifications() => SqliteDbContext.Create().Notifications.OrderByDescending(notification => (long)notification.Time).Take(10);
    }
}
