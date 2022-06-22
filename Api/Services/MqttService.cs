using Api.Database.Models;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System.Text;
using System.Text.Json;

namespace Api.Services.MqttHandler;

public class MqttService
{
    private readonly DatabaseService _databaseService;
    private readonly EmailService _emailService;
    private readonly WebSocketService _webSocketService;

    public MqttService(DatabaseService databaseService, EmailService emailService, WebSocketService webSocketService)
    {
        _databaseService = databaseService;
        _emailService = emailService;
        _webSocketService = webSocketService;
    }

    public void Start()
        => HandleReceivedMessages();

    private void HandleReceivedMessages()
    {
        _ = Task.Run(async () => 
        {
            var mqttFactory = new MqttFactory();

            using var mqttClient = mqttFactory.CreateMqttClient();

            var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer("95.217.2.100", 1883)
                .WithCredentials("chengeta_user", "chengeta2022")
                .Build();

            mqttClient.UseApplicationMessageReceivedHandler(MessageHandler);

            await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(f => { f.WithTopic("chengeta/notifications"); })
                .Build();

            await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

            Console.WriteLine("MQTT client subscribed to topic.");

            await Task.Delay(-1);
        });
    }

    private async Task MessageHandler(MqttApplicationMessageReceivedEventArgs args)
    {
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var notification = JsonSerializer.Deserialize<Notification>(Encoding.UTF8.GetString(args.ApplicationMessage.Payload), options);

        if (notification != null)
        {            
            await _databaseService.AddNotificationAsync(notification);
            _emailService.MailSubscribers(notification);
            _webSocketService.SendMessage(JsonSerializer.Serialize(notification, options));
        }
        
        
    }
}