using Api.Models.Notification;

namespace Api.Singletons.Notifications;

sealed class Notifications
{
    private static Notifications _instance = null;
    private static readonly object _lock = new object();
    private Notification[] Data {get; set;}
    private Notifications()
    {
        
    }

    public static Notifications Instance
    {
        get
        {
            lock(_lock)
            {
                if (_instance == null)
                {
                    _instance = new Notifications();
                }
                return _instance;
            }
        }
    }
}