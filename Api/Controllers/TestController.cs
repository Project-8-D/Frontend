using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[EnableCors]
[ApiController]
[Route("api")]
public class TestController : ControllerBase
{

    [HttpGet("test")]
    public IActionResult Get()
    {
        return Ok(new
        {
            message = "Hello, World!"
        });
    }
}
