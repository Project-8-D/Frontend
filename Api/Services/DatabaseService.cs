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

        public async Task SubscribeEmailAsync(string email)
        {
            var context = SqliteDbContext.Create();

            context.Subscribers.Add(new Subscriber{Email=email});
            await context.SaveChangesAsync();
        }

        public async Task UnsubscribeEmailAsync(string email)
        {
            var context = SqliteDbContext.Create();

            if (context.Subscribers.FirstOrDefault(x => x.Email == email) is Subscriber subscriber)
            {
                context.Subscribers.Remove(subscriber);
                await context.SaveChangesAsync();
            }

        }
    }
}
