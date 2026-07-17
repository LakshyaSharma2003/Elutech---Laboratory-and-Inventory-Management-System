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

    // Employee self-reported check-in — REFERENCE ONLY for the Manager.
    // Does not mark official attendance; Manager still marks it manually.
    [Authorize(Policy = "EmployeeOnly")]
    [HttpPost("self-checkin")]
    public async Task<IActionResult> SelfCheckIn(SelfCheckDto dto)
    {
        var result = await _service.SelfCheckIn(dto.EmployeeId);
        return Ok(result);
    }

    [Authorize(Policy = "EmployeeOnly")]
    [HttpPost("self-checkout")]
    public async Task<IActionResult> SelfCheckOut(SelfCheckDto dto)
    {
        var result = await _service.SelfCheckOut(dto.EmployeeId);
        return Ok(result);
    }

    // Manager reference view — who has self-reported in/out today, and when
    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("self-logs/today")]
    public async Task<IActionResult> TodaySelfLogs()
    {
        return Ok(await _service.GetTodaySelfCheckLogs());
    }

    // Employee checks their OWN today's status — used to restore check-in
    // button state correctly after a page reload or re-login.
    [Authorize(Policy = "EmployeeOnly")]
    [HttpGet("self-status/{employeeId}")]
    public async Task<IActionResult> MyTodayStatus(int employeeId)
    {
        var result = await _service.GetMyTodayStatus(employeeId);
        return Ok(result);
    }
}


