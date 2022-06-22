using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using Api.Database.Models;

namespace Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly EmailService _emailService;

        public AccountController(DatabaseService databaseService, EmailService emailService)
        {
            _databaseService = databaseService;
            _emailService = emailService;
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
            if (_databaseService.GetUserByResetCode(resetPasswordModel.ResetCode) is not User user)
                return BadRequest(new { success = false, message = "Reset code is invalid." });
            
            if (resetPasswordModel.Password != resetPasswordModel.ConfirmPassword)
                return BadRequest(new { success = false, message = "The passwords don't match." });

            try
            {
                await _databaseService.UpdateUserPasswordAsync(user.Email, resetPasswordModel.Password);
            }
            catch(Exception e)
            {
                return NotFound(new { success = false, message = e.Message });
            }

            return Ok(new { success = true, message = "Password has been succesfully changed." });
        }

        [HttpPost]
        [Route("sendresetconfirmation")]
        public async Task<IActionResult> SendResetConfirmation([FromBody] string email)
        {
            var code = GenerateCode();

            var result = await _databaseService.SetResetCodeAsync(email, code);

            if (result)
            {
                _emailService.SendMail("Password reset code", @$"
                    <h1>Password reset</h1>
                    <p>You have requested a password reset. Your reset code is <b>{code}</b>. If you did not request a password reset, you may ignore this e-mail.</p>
                    <img src='https://ichef.bbci.co.uk/images/ic/976xn/p08h0lkd.jpg' style = 'width: 500px'>
                ", email);
            }

            return Ok();
        }
        
        private static string GenerateCode()
        {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6)
                .Select(s => s[new Random().Next(s.Length)]).ToArray());
        }
    }
}
