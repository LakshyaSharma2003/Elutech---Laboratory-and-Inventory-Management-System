using Asp.Versioning;
using EluTech.API.DTOs.Employee;
using EluTech.API.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;



[ApiController]

[Route("api/[controller]")]
[ApiVersion("1.0")]


[Authorize(

Policy = "ManagerOnly"

)]

public class EmployeeController : ControllerBase
{


    private readonly IEmployeeService _service;



    public EmployeeController(

    IEmployeeService service)
    {


        _service = service;

    }



    [HttpPost]

    public async Task<IActionResult>

    AddEmployee(

    AddEmployeeDto dto)
    {


        await _service.AddEmployee(

        dto);



        return Ok();

    }



    [Authorize(Policy = "FinanceOnly")]
    [HttpGet]

    public async Task<IActionResult>

    GetEmployees()
    {


        return Ok(

        await _service.GetEmployees()

        );


    }




    [HttpDelete("{id}")]

    public async Task<IActionResult>

    FireEmployee(

    int id)
    {


        await _service.FireEmployee(

        id);



        return Ok();


    }




    // Get current logged-in user's employeeId - no policy, any authenticated user
    [AllowAnonymous]
    [HttpGet("my-id")]
    public async Task<IActionResult> GetMyEmployeeId()
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out int userId))
            return BadRequest(new { message = "Invalid token" });

        var result = await _service.GetEmployeeIdByUserId(userId);
        if (result == null)
            return NotFound(new { message = "Employee record not found for this user" });

        return Ok(result);
    }

}