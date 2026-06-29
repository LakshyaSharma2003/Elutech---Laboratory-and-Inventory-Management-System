using Asp.Versioning;
using EluTech.API.DTOs.Attendance;
using EluTech.API.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace EluTech.API.Controllers;



[ApiController]

[Route("api/[controller]")]
[ApiVersion("1.0")]


public class AttendanceController
: ControllerBase
{


    private readonly IAttendanceService
    _service;



    public AttendanceController(

    IAttendanceService service)
    {


        _service = service;


    }



    [Authorize(

    Policy = "ManagerOnly"

    )]

    [HttpPost]


    public async Task<IActionResult>

    MarkAttendance(

    MarkAttendanceDto dto)
    {


        await _service.MarkAttendance(

        dto);



        return Ok();


    }




    [Authorize(

    Policy = "ManagerOnly"

    )]

    [HttpGet]


    public async Task<IActionResult>

    GetAttendance()
    {


        return Ok(

        await _service.GetAttendance()

        );


    }




    [Authorize]

    [HttpGet("{id}")]


    public async Task<IActionResult>

    GetEmployeeAttendance(

    int id)
    {


        return Ok(

        await _service.GetEmployeeAttendance(

        id));


    }


    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("checkout/{id}")]
    public async Task<IActionResult> CheckOut(int id, [FromBody] CheckOutDto dto)
    {
        await _service.CheckOut(id, dto.CheckOut);
        return Ok();
    }


    [Authorize(

Policy = "ManagerOnly"

)]

    [HttpGet(

"today"

)]


    public async Task<IActionResult>

Today()
    {


        return Ok(

        await _service.GetTodayAttendance()

        );



    }


    [Authorize(

Policy = "ManagerOnly"

)]

    [HttpGet(

"summary"

)]


    public async Task<IActionResult>

Summary()
    {


        return Ok(

        await _service.GetMonthlySummary()

        );


    }

    [Authorize(

Policy = "ManagerOnly"

)]

    [HttpGet(

"export"

)]



    public async Task<IActionResult>

Export()
    {


        var file =

        await _service.ExportAttendance();



        return File(


        file,


        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",



        "Attendance.xlsx"



        );


    }
}


