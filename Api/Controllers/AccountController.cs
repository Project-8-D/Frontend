using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public AccountController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterAsync(RegisterModel registerModel)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerModel.Password);

            var user = await _databaseService.AddUserAsync(registerModel.Email, registerModel.Name, passwordHash);

            return user != null ? Ok() : BadRequest();
        }
    }
}
