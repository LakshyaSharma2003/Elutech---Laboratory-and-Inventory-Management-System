using Asp.Versioning;
using EluTech.API.DTOs.Sample;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
public class SampleController : ControllerBase
{
    private readonly ISampleService _service;

    public SampleController(ISampleService service)
    {
        _service = service;
    }


    //------------------------------------------------
    // Manager
    //------------------------------------------------

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("add-sample")]
    public async Task<IActionResult> AddSample(
        AddSampleDto dto)
    {

        await _service.AddSample(dto);

        return Ok(new
        {
            Message = "Sample Added Successfully"
        });

    }


    //------------------------------------------------
    // Manager
    //------------------------------------------------

    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("samples")]
    public async Task<IActionResult> GetSamples()
    {

        var data = await _service.GetSamples();


        return Ok(data);

    }


    //------------------------------------------------
    // Employee
    //------------------------------------------------

    [Authorize(Policy = "EmployeeOnly")]
    [HttpPost("request-phase")]
    public async Task<IActionResult> RequestPhase(
        RequestPhaseDto dto)
    {

        await _service.RequestPhase(dto);


        return Ok(new
        {
            Message = "Phase Request Submitted"
        });

    }


    //------------------------------------------------
    // Manager
    //------------------------------------------------

    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("approve-request/{id}")]
    public async Task<IActionResult> ApproveRequest(
        int id)
    {

        await _service.ApproveRequest(id);


        return Ok(new
        {
            Message = "Request Approved"
        });

    }


    //------------------------------------------------
    // Manager
    //------------------------------------------------

    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("reject-request/{id}")]
    public async Task<IActionResult> RejectRequest(
        int id)
    {

        await _service.RejectRequest(id);


        return Ok(new
        {
            Message = "Request Rejected"
        });

    }


    //------------------------------------------------
    // Employee - get own assigned samples
    //------------------------------------------------

    [Authorize(Policy = "EmployeeOnly")]
    [HttpGet("my-samples/{employeeId}")]
    public async Task<IActionResult> GetMySamples(int employeeId)
    {
        var data = await _service.GetSamplesByEmployee(employeeId);
        return Ok(data);
    }


}