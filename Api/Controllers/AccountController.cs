using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;

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

        [HttpPost]
        [Route("resetpassword")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordModel resetPasswordModel)
        {
            if (resetPasswordModel.Password != resetPasswordModel.ConfirmPassword)
                return BadRequest(new { success = false, message = "The passwords don't match." });

            try
            {
                await _databaseService.UpdateUserPasswordAsync(resetPasswordModel.Email, resetPasswordModel.Password);
            }
            catch(Exception e)
            {
                return NotFound(new { success = false, message = e.Message });
            }

            return Ok(new { success = true, message = "Password has been succesfully changed." });
        }
    }
}
