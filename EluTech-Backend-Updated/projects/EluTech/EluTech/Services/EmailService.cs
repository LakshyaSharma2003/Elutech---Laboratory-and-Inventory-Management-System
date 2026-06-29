using MailKit.Net.Smtp;

using MimeKit;

using EluTech.API.Interfaces;



namespace EluTech.API.Services;



public class EmailService : IEmailService
{


    IConfiguration _config;



    public EmailService(
    IConfiguration config)
    {


        _config = config;

    }



    public async Task SendEmail(

    string to,

    string subject,

    string body
    )
    {


        var email = new MimeMessage();



        email.From.Add(

        MailboxAddress.Parse(

        _config["EmailSettings:From"]

        ));



        email.To.Add(

        MailboxAddress.Parse(to));



        email.Subject = subject;




        email.Body = new TextPart(

        MimeKit.Text.TextFormat.Html)

        {

            Text = body

        };



        using var smtp = new SmtpClient();



        await smtp.ConnectAsync(

        _config["EmailSettings:Host"],

        587,


        MailKit.Security.SecureSocketOptions.StartTls

        );



        await smtp.AuthenticateAsync(

        _config["EmailSettings:Username"],


        _config["EmailSettings:Password"]

        );




        await smtp.SendAsync(email);



        await smtp.DisconnectAsync(true);



    }



}