namespace EluTech.API.Helpers;



public class OtpGenerator
{




    public static string Generate()
    {


        Random random = new();



        return random.Next(

        100000,

        999999

        ).ToString();



    }



}