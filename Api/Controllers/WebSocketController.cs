using Microsoft.AspNetCore.Mvc;
using Api.Services;

namespace Api.Controllers;

public class WebSocketController : ControllerBase
{
    private readonly WebSocketService _webSocketService;

    public WebSocketController(WebSocketService webSocketService)
    {
        _webSocketService = webSocketService;
    }

    [HttpGet("/ws")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
          using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
          var tcs = new TaskCompletionSource();

          _webSocketService.AddConnection(webSocket, tcs);

          await tcs.Task;
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
}