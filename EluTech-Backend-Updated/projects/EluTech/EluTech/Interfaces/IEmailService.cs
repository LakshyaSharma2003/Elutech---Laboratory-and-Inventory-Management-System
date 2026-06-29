namespace EluTech.API.Interfaces;

public interface IEmailService
{

    Task SendEmail(

    string to,

    string subject,

    string body

    );


}