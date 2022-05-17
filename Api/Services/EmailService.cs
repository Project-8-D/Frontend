using Api.Database.Models;
using Api.Database;
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

    public async void MailSubscribersAsync(Notification notification)
    {
        if (notification == null)
            return;

        // get all subscribers from database
        var context = SqliteDbContext.Create();

        foreach (var User in context.Subscribers)
        {
            SendEmailAsync(User.Email, notification);
        }
    }

    public void SendEmailAsync(string adress, Notification content) 
    {
        SmtpClient SmtpServer = new SmtpClient("smtp-mail.outlook.com");
            var mail = new MailMessage();
            mail.From = new MailAddress("chengeta_guns@hotmail.com");
            mail.To.Add(adress);
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