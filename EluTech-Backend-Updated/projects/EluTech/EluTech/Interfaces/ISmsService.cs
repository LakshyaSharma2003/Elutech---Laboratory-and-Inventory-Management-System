namespace EluTech.API.Interfaces;

public interface ISmsService
{

    Task SendSms(
        string phoneNumber,
        string message
    );


}