using Asp.Versioning;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;



[ApiController]

[Route("api/[controller]")]
[ApiVersion("1.0")]
public class DashboardController
: ControllerBase
{

    private readonly IDashboardService _service;



    public DashboardController(

        IDashboardService service)
    {

        _service = service;

    }




    [Authorize(

        Policy = "ManagerOnly")]



    [HttpGet(

        "manager")]



    public async Task<IActionResult>

        Manager()
    {

        return Ok(

            await _service

            .ManagerDashboard());

    }




    [Authorize(

        Policy = "FinanceOnly")]



    [HttpGet(

        "finance")]


    public async Task<IActionResult>

        Finance()
    {

        return Ok(

            await _service

            .FinanceDashboard());

    }




    [Authorize(

        Policy = "EmployeeOnly")]



    [HttpGet(

        "employee/{id}")]


    public async Task<IActionResult>

        Employee(

        int id)
    {


        return Ok(

            await _service

            .EmployeeDashboard(

            id));

    }


}