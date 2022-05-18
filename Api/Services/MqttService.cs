using Api.Database.Models;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using Newtonsoft.Json;
using System.Text;

namespace Api.Services.MqttHandler;

public class MqttService
{
    private readonly DatabaseService _databaseService;
    private readonly EmailService _emailService;

    public MqttService(DatabaseService databaseService, EmailService emailService)
    {
        _databaseService = databaseService;
        _emailService = emailService;
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
        var notification = JsonConvert.DeserializeObject<Notification>(Encoding.UTF8.GetString(args.ApplicationMessage.Payload));

        if (notification != null)
        {
            await _databaseService.AddNotificationAsync(notification);
            _emailService.MailSubscribers(notification);
        }
    }
}