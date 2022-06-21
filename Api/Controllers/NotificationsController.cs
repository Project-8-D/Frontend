using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Api.Database;
using Api.Database.Models;

namespace Api.Controllers;

[EnableCors]
[ApiController]
[Route("api")]
public class NotificationsController : ControllerBase
{
    private readonly DatabaseService _databaseService;

    public NotificationsController(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    [HttpGet("notifications")]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_databaseService.GetNotifications());
    }

    [HttpPost("subscribe")]
    [Authorize]
    public async Task<IActionResult> Post([FromHeader] string authorization)
    {
        if (BasicAuthenticationHeaderValue.TryParse(authorization, out var headerValue))
        {
            var token = headerValue.Parameter;
            var email = new JwtSecurityToken(token).Claims.FirstOrDefault(x => x.Type == "email").Value;
            if (email != null)
            {
                await _databaseService.ToggleSubscription(email);
                return Ok(email);
            }
            return BadRequest("doe wel ff email sture pls bb");

        }
        return BadRequest("doe niet :(");
        
    }

    [HttpGet("subscribed")]
    [Authorize]
    public async Task<IActionResult> Get([FromHeader] string authorization)
    {
        if (BasicAuthenticationHeaderValue.TryParse(authorization, out var headerValue))
        {
            var token = headerValue.Parameter;
            var email = new JwtSecurityToken(token).Claims.FirstOrDefault(x => x.Type == "email").Value;
            if (email != null)
            {
                var context = SqliteDbContext.Create();
                if (context.Subscribers.FirstOrDefault(x => x.Email == email) is Subscriber subscriber) 
                {
                    return Ok("Subscribed");
                }
                return Ok("Not subscribed");
                
            }
            return BadRequest("doe wel ff email sture pls bb");

        }
        return BadRequest("doe niet :(");
        
    }
}
