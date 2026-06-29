using Asp.Versioning;
using EluTech.API.DTOs.Report;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
public class ReportController
: ControllerBase
{

    private readonly IReportService
    _service;



    public ReportController(

    IReportService service)
    {

        _service = service;

    }



    [Authorize(

    Policy = "EmployeeOnly")]


    [HttpPost("upload")]


    public async Task<IActionResult>

    Upload(

    IFormFile file,

    [FromForm]

UploadReportDto dto)
    {

        await _service.UploadReport(

        file,

        dto);



        return Ok();

    }



    [HttpGet]


    public async Task<IActionResult>

    Reports()
    {


        return Ok(

        await _service.GetReports()

        );

    }



    [Authorize(

    Policy = "ManagerOnly")]



    [HttpPut(

    "approve/{id}")]


    public async Task<IActionResult>

    Approve(

    int id)
    {


        await _service.ApproveReport(

        id);



        return Ok();


    }



    [Authorize(

    Policy = "ManagerOnly")]


    [HttpPut(

    "reject/{id}")]


    public async Task<IActionResult>

    Reject(

    int id)
    {


        await _service.RejectReport(

        id);



        return Ok();


    }



}