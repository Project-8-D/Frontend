using Api.Database.Models;
using Api.Database;
using System.Linq;
using System.Net.Mail;
using System.Net;

namespace Api.Services;

public class EmailService
{
    private readonly DatabaseService _databaseService;

    public EmailService(DatabaseService databaseService) 
    {
        _databaseService = databaseService;
    }

    public void MailSubscribers(Notification notification) 
    {
        var context = SqliteDbContext.Create();

        if (!context.Subscribers.Any())
            return;

        SmtpClient SmtpServer = new SmtpClient("smtp-mail.outlook.com");
        var mail = new MailMessage();
        mail.From = new MailAddress("chengeta_guns@hotmail.com");

        foreach (var user in context.Subscribers)
        {
            mail.To.Add(user.Email);
        }

        mail.Subject = "Gunshot notification";
        mail.IsBodyHtml = true;
        string htmlBody;
        htmlBody = @"
            <h1>Title</h1>
            <p>Notification message</p>
            <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>Link to something</a>
            <img src='https://ichef.bbci.co.uk/images/ic/976xn/p08h0lkd.jpg' style = 'width: 500px'>
            <p>Footer message</p>
        ";
        mail.Body = htmlBody;
        SmtpServer.Port = 587;
        SmtpServer.UseDefaultCredentials = false;
        SmtpServer.Credentials = new System.Net.NetworkCredential("chengeta_guns@hotmail.com", "PASSWORD!@#$%");
        SmtpServer.EnableSsl = true;
        SmtpServer.Send(mail);
    }
    
}