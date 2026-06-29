namespace EluTech.API.Middlewares;

public static class MiddlewareExtensions
{


    public static IApplicationBuilder

        UseCustomExceptionMiddleware(

            this IApplicationBuilder app

            )

    {


        return app.UseMiddleware<ExceptionMiddleware>();


    }



}