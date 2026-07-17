using Asp.Versioning;
using EluTech.API.DTOs.Report;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
public class ReportController : ControllerBase
{
    private readonly IReportService _service;

    public ReportController(IReportService service)
    {
        _service = service;
    }

    [Authorize(Policy = "EmployeeOnly")]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] UploadReportDto dto)
    {
        await _service.UploadReport(file, dto);
        return Ok(new { Message = "Report uploaded successfully" });
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Reports()
    {
        return Ok(await _service.GetReports());
    }

    // View/open the uploaded report file — Manager AND Employee can view
    [Authorize]
    [HttpGet("view/{id}")]
    public async Task<IActionResult> ViewReport(int id)
    {
        var (bytes, fileName, contentType) = await _service.GetReportFile(id);
        // inline so browsers open PDFs/images directly instead of forcing download
        Response.Headers.Append("Content-Disposition", $"inline; filename=\"{fileName}\"");
        return File(bytes, contentType);
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("approve/{id}")]
    public async Task<IActionResult> Approve(int id)
    {
        await _service.ApproveReport(id);
        return Ok(new { Message = "Report approved" });
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPut("reject/{id}")]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectReportDto dto)
    {
        await _service.RejectReport(id, dto.ManagerRemarks);
        return Ok(new { Message = "Report rejected" });
    }
}
