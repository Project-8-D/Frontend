using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System.Text;

namespace Api.Services.MqttHandler;

public class MqttHandler
{
    public static async Task HandleReceivedMessages()
    {
        var mqttFactory = new MqttFactory();
        using (var mqttClient = mqttFactory.CreateMqttClient())
        {
            var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer("95.217.2.100", 1883)
                .WithCredentials("chengeta_user", "chengeta2022")
                .Build();

            mqttClient.UseApplicationMessageReceivedHandler(e => { MessageHandler(e.ApplicationMessage); });

            await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(f => { f.WithTopic("chengeta/notifications"); })
                .Build();

            await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

            Console.WriteLine("MQTT client subscribed to topic.");

        }
    }

    public static void MessageHandler(MqttApplicationMessage appMsg)
    {
        Console.WriteLine(Encoding.UTF8.GetString(appMsg.Payload));
    }
}