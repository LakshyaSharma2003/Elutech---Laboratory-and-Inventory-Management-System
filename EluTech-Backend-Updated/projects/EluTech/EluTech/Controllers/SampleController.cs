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

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("add-sample")]
    public async Task<IActionResult> AddSample(AddSampleDto dto)
    {
        await _service.AddSample(dto);
        return Ok(new { Message = "Sample Added Successfully" });
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("samples")]
    public async Task<IActionResult> GetSamples()
    {
        return Ok(await _service.GetSamples());
    }

    // Government / Private tab filter
    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("samples/{sampleType}")]
    public async Task<IActionResult> GetSamplesByType(string sampleType)
    {
        return Ok(await _service.GetSamplesByType(sampleType));
    }

    [Authorize(Policy = "EmployeeOnly")]
    [HttpPost("request-phase")]
    public async Task<IActionResult> RequestPhase(RequestPhaseDto dto)
    {
        await _service.RequestPhase(dto);
        return Ok(new { Message = "Phase Request Submitted" });
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("approve-request/{id}")]
    public async Task<IActionResult> ApproveRequest(int id)
    {
        await _service.ApproveRequest(id);
        return Ok(new { Message = "Request Approved" });
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("reject-request/{id}")]
    public async Task<IActionResult> RejectRequest(int id)
    {
        await _service.RejectRequest(id);
        return Ok(new { Message = "Request Rejected" });
    }

    [Authorize(Policy = "EmployeeOnly")]
    [HttpGet("my-samples/{employeeId}")]
    public async Task<IActionResult> GetMySamples(int employeeId)
    {
        var data = await _service.GetSamplesByEmployee(employeeId);
        return Ok(data);
    }

    // Fill in / edit details that weren't available at intake time
    [Authorize]
    [HttpPut("{id}/update-details")]
    public async Task<IActionResult> UpdateDetails(int id, UpdateSampleDetailsDto dto)
    {
        await _service.UpdateSampleDetails(id, dto);
        return Ok(new { Message = "Sample details updated" });
    }

    // Employee accepts an assigned sample and sets expected completion date
    [Authorize(Policy = "EmployeeOnly")]
    [HttpPut("{id}/accept")]
    public async Task<IActionResult> Accept(int id, AcceptSampleDto dto)
    {
        await _service.AcceptSample(id, dto);
        return Ok(new { Message = "Sample accepted" });
    }

    // Employee rejects an assigned sample with a reason
    [Authorize(Policy = "EmployeeOnly")]
    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id, RejectSampleDto dto)
    {
        await _service.RejectSample(id, dto);
        return Ok(new { Message = "Sample rejected" });
    }

    // Employee posts a progress update with remarks
    [Authorize(Policy = "EmployeeOnly")]
    [HttpPost("progress")]
    public async Task<IActionResult> AddProgress(AddProgressDto dto)
    {
        await _service.AddProgress(dto);
        return Ok(new { Message = "Progress updated" });
    }

    [Authorize]
    [HttpGet("progress/{sampleId}")]
    public async Task<IActionResult> GetProgress(int sampleId)
    {
        return Ok(await _service.GetProgressLogs(sampleId));
    }
}
