using EluTech.API.Interfaces;

namespace EluTech.API.Services;


public class SmsService : ISmsService
{


    public async Task SendSms(

        string phoneNumber,

        string message
        )
    {


        Console.WriteLine(

            $"SMS TO : {phoneNumber}"

            );


        Console.WriteLine(message);



        await Task.CompletedTask;

    }


}