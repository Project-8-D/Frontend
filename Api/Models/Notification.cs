namespace Api.Models.Notification;

public class Notification
{
    public long Time {get; set;}
    public uint NodeId {get; set;}
    public double Latitude {get; set;}
    public double Longitude {get; set;}
    public string SoundType {get; set;}
    public uint Propability {get; set;}
    public string Sound {get; set;}
}