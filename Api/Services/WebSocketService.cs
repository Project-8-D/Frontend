using System.Net.WebSockets;
using System.Text;

namespace Api.Services;

public class WebSocketService
{
    private readonly HashSet<(WebSocket Ws, TaskCompletionSource Tcs)> _connections = new();

    public void AddConnection(WebSocket webSocket, TaskCompletionSource tcs)
    {
        _connections.Add((webSocket, tcs));
    }

    public void SendMessage(string message)
    {
        Parallel.ForEach(_connections, async connection => {
            await connection.Ws.SendAsync(
                new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );

            var response = await connection.Ws.ReceiveAsync(ArraySegment<byte>.Empty, CancellationToken.None);
            if (response.MessageType == WebSocketMessageType.Close)
            {
                await connection.Ws.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                _connections.Remove(connection);
                connection.Tcs.TrySetResult();
            }
        });
    }
}