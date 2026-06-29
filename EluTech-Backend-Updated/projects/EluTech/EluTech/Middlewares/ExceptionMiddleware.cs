using System.Text.Json;

using EluTech.API.DTOs.Common;

namespace EluTech.API.Middlewares;

public class ExceptionMiddleware
{


    private readonly RequestDelegate _next;



    public ExceptionMiddleware(
        RequestDelegate next)
    {

        _next = next;

    }




    public async Task InvokeAsync(
        HttpContext context)
    {


        try
        {

            await _next(context);

        }

        catch (Exception ex)
        {


            context.Response.ContentType =
                "application/json";


            context.Response.StatusCode = 500;




            var error = new ErrorResponseDto
            {

                StatusCode = 500,

                Message = ex.Message,


                Details = ex.InnerException?.Message

            };



            var json = JsonSerializer.Serialize(
                error
            );



            await context.Response.WriteAsync(
                json
            );


        }



    }



}