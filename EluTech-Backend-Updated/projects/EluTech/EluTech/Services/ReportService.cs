using EluTech.API.Data;
using EluTech.API.DTOs.Report;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ReportService(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task UploadReport(IFormFile file, UploadReportDto dto)
    {
        if (file == null)
            throw new Exception("File not found");

        if (string.IsNullOrWhiteSpace(dto.ReportNumber))
            throw new Exception("Report number is required");

        // Enforce uniqueness of the test report number across ALL reports
        bool exists = await _context.Reports
            .AnyAsync(x => x.ReportNumber == dto.ReportNumber);

        if (exists)
            throw new Exception($"Report number '{dto.ReportNumber}' is already in use. Please use a unique report number.");

        string folder = Path.Combine(_env.WebRootPath ?? "wwwroot", "Reports");
        Directory.CreateDirectory(folder);

        string savedFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        string fullPath = Path.Combine(folder, savedFileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        int version = await _context.Reports.CountAsync(x => x.SampleId == dto.SampleId) + 1;

        Report report = new()
        {
            SampleId = dto.SampleId,
            EmployeeId = dto.EmployeeId,
            ReportNumber = dto.ReportNumber,
            FileName = file.FileName,
            FilePath = fullPath,
            Version = version,
            IsApproved = false,
            Status = "Pending",
            Remarks = dto.Remarks
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ReportDto>> GetReports()
    {
        return await _context.Reports
            .Include(x => x.Sample)
            .Include(x => x.Employee).ThenInclude(x => x.User)
            .Select(x => new ReportDto
            {
                Id = x.Id,
                SampleId = x.SampleId,
                EmployeeUserId = x.Employee.UserId,
                ReportNumber = x.ReportNumber,
                Sample = x.Sample.SampleName,
                Employee = x.Employee.User.FullName,
                Version = x.Version,
                Approved = x.IsApproved,
                Status = x.Status,
                FileName = x.FileName,
                Remarks = x.Remarks,
                ManagerRemarks = x.ManagerRemarks
            })
            .ToListAsync();
    }

    public async Task<(byte[] Bytes, string FileName, string ContentType)> GetReportFile(int id)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(x => x.Id == id);
        if (report == null) throw new Exception("Report not found");
        if (!File.Exists(report.FilePath)) throw new Exception("Report file is missing on the server");

        var bytes = await File.ReadAllBytesAsync(report.FilePath);

        string ext = Path.GetExtension(report.FilePath).ToLowerInvariant();
        string contentType = ext switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            _ => "application/octet-stream"
        };

        return (bytes, report.FileName ?? $"report_{id}{ext}", contentType);
    }

    public async Task ApproveReport(int id)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(x => x.Id == id);
        if (report == null) throw new Exception("Report not found");

        report.IsApproved = true;
        report.Status = "Approved";
        report.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task RejectReport(int id, string? managerRemarks)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(x => x.Id == id);
        if (report == null) throw new Exception("Report not found");

        report.IsApproved = false;
        report.Status = "Rejected";
        report.ManagerRemarks = managerRemarks;
        report.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
}
