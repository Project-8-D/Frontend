using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Api.Services;

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
    public IActionResult Get()
    {
        return Ok(_databaseService.GetNotifications());
    }
}
