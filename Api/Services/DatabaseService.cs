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

        public async Task ToggleSubscription(string email) {
            var context = SqliteDbContext.Create();

            if (context.Subscribers.FirstOrDefault(x => x.Email == email) is Subscriber subscriber) 
            {
                context.Subscribers.Remove(subscriber);
            } 
            else 
            {
                context.Subscribers.Add(new Subscriber{Email=email});
            }

            await context.SaveChangesAsync();
        }

        public IEnumerable<Notification> GetNotifications() => SqliteDbContext.Create().Notifications.OrderByDescending(notification => (long)notification.Time);

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

        public async Task UpdateUserPasswordAsync(string email, string newPassword)
        {
            var context = SqliteDbContext.Create();

            if (context.Users.FirstOrDefault(x => x.Email == email) is User user)
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                context.Users.Update(user);

                await context.SaveChangesAsync();
            }
            else
                throw new Exception("This e-mail is not registered to an account.");
        }

        public async Task<bool> SetResolvedAsync(Guid guid, bool resolved)
        {
            var context = SqliteDbContext.Create();

            if (context.Notifications.FirstOrDefault(x => x.Guid == guid) is Notification notification)
            {
                notification.Resolved = resolved;
                return (await context.SaveChangesAsync()) > 0;
            }

            return false;
        }
    }
}
