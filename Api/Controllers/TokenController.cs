using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Controllers;

[EnableCors]
[ApiController]
[Route("api/login")]
public class TokenController : ControllerBase
{
    public IConfiguration _configuration;
    private readonly DatabaseService _databaseService;

    public TokenController(IConfiguration config, DatabaseService databaseService)
    {
        _configuration = config;
        _databaseService = databaseService;
    }

    [HttpPost]
    public IActionResult Post(LoginModel loginModel)
    {
        if (loginModel != null && loginModel.Email != null && loginModel.Password != null)
        {
            var user = _databaseService.VerifyUserLogin(loginModel.Email, loginModel.Password);

            if (user != null)
            {
                var claims = new[]
                {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim("id", user.Id.ToString()),
                        new Claim("name", user.Name),
                        new Claim("email", user.Email)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims,
                    expires: DateTime.Now.AddHours(24), signingCredentials: credentials);

                return Ok(new JwtSecurityTokenHandler().WriteToken(token));
            }
            else
            {
                return BadRequest("Invalid credentials");
            }
        }
        else
        {
            return BadRequest();
        }
    }
}
