using Api.Database;
using Api.Database.Models;

namespace Api.Services
{
    public class DatabaseService
    {
        private readonly SqliteDbContext _dbContext;

        public DatabaseService(SqliteDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Test? GetTest()
            => _dbContext.Test.FirstOrDefault();
    }
}
