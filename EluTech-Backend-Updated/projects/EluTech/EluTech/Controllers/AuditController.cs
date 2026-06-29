using Asp.Versioning;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;



[ApiController]

[Route("api/[controller]")]
[ApiVersion("1.0")]

[Authorize(

Policy = "ManagerOnly")]

public class AuditController
: ControllerBase
{

    private readonly IAuditService
    _service;



    public AuditController(

    IAuditService service)
    {

        _service = service;

    }



    [HttpGet]


    public async Task<IActionResult>

    Logs()
    {

        return Ok(

        await _service.GetLogs()

        );


    }


}