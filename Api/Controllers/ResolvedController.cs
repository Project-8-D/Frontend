using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Api.Services;
using Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[EnableCors]
[ApiController]
[Route("api")]
public class ResolvedController : ControllerBase
{
    private readonly DatabaseService _databaseService;

    public ResolvedController(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    [HttpPost("resolve")]
    [Authorize]
    public async Task<IActionResult> Post(ResolvedModel resolvedModel)
    {
        if (resolvedModel == null || resolvedModel.Guid == null || resolvedModel.Resolved == null)
            return BadRequest();
        
        if (await _databaseService.SetResolvedAsync(resolvedModel.Guid, resolvedModel.Resolved))
            return Ok();
        return StatusCode(500);
    }
}
