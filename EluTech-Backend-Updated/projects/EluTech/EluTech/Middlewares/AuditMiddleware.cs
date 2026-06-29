public class AuditMiddleware
{

    private readonly RequestDelegate
    _next;


    public AuditMiddleware(

    RequestDelegate next)
    {

        _next = next;

    }



    public async Task Invoke(

    HttpContext context)
    {


        await _next(context);


    }



}