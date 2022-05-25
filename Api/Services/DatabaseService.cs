using Api.Database;
using Api.Database.Models;

namespace Api.Services
{
    public class DatabaseService
    {
        public async Task AddNotificationAsync(Notification notification)
        {
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

        public IEnumerable<Notification> GetNotifications() => SqliteDbContext.Create().Notifications.OrderByDescending(notification => (long)notification.Time).Take(10);

        public User? VerifyUserLogin(string email, string password)
        {
            if (SqliteDbContext.Create().Users.FirstOrDefault(x => x.Email == email) is not User user)
                return null;

            return BCrypt.Net.BCrypt.Verify(password, user.Password) ? user : null;
        }

        public async Task<User?> AddUserAsync(string email, string name, string passwordHash)
        {
            var context = SqliteDbContext.Create();

            if (!context.Users.Any(x => x.Email == email))
            {
                context.Users.Add(new User
                {
                    Email = email,
                    Name = name,
                    Password = passwordHash
                });

                await context.SaveChangesAsync();

                return context.Users.First(x => x.Email == email);
            }

            return null;
        }
    }
}
