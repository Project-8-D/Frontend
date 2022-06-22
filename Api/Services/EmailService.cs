using Api.Database.Models;
using Api.Database;
using System.Net.Mail;
using System.Net;

namespace Api.Services;

public class EmailService
{
    public void MailSubscribers(Notification notification) 
    {
        var context = SqliteDbContext.Create();

        if (!context.Subscribers.Any())
            return;

        var epoch = new DateTime(1970, 1, 1, 0, 0, 0);
        epoch = epoch.AddSeconds(notification.Time).ToLocalTime();
        var dt = epoch.ToString("HH:mm");

        SendMail($"{notification.SoundType} detection - {dt}", @$"
            <h1>{notification.SoundType}</h1>
            <p>A {notification.SoundType} has been detected at<br>latutude: {notification.Latitude}<br>longitude: {notification.Longitude}</p>
            <a href='https://www.chengeta.xyz'>Go to dashboard</a><br>
            <img src='https://ichef.bbci.co.uk/images/ic/976xn/p08h0lkd.jpg' style = 'width: 500px'>
        ", context.Subscribers.Select(x => x.Email).ToArray());
    }

    public void SendMail(string subject, string body, params string[] recipients)
    {
        using var smtpServer = new SmtpClient("smtp-mail.outlook.com");
        var mail = new MailMessage();
        mail.From = new MailAddress("chengeta_guns@hotmail.com");

        foreach (var recipient in recipients)
            mail.To.Add(recipient);
        
        mail.Subject = subject;
        mail.IsBodyHtml = true;
        mail.Body = body;
        smtpServer.Port = 587;
        smtpServer.UseDefaultCredentials = false;
        smtpServer.Credentials = new NetworkCredential("chengeta_guns@hotmail.com", "PASSWORD!@#$%");
        smtpServer.EnableSsl = true;
        smtpServer.Send(mail);
    }
}