using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

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
