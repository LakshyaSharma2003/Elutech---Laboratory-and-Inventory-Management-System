using EluTech.API.Data;
using EluTech.API.DTOs.Sample;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class SampleService : ISampleService
{
    private readonly ApplicationDbContext _context;

    public SampleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddSample(AddSampleDto dto)
    {
        Sample sample = new()
        {
            SampleCode = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
            SampleName = dto.SampleName,
            SampleType = string.IsNullOrWhiteSpace(dto.SampleType) ? "Private" : dto.SampleType,
            CustomerId = dto.SampleType == "Government" ? null : dto.CustomerId,
            BranchName = dto.SampleType == "Government" ? dto.BranchName : null,
            BranchAddress = dto.SampleType == "Government" ? dto.BranchAddress : null,
            AssignedEmployeeId = dto.AssignedEmployeeId,
            CurrentPhase = "Received",
            Status = "Active",
            ReceivedDate = DateTime.UtcNow,
            DateArrived = dto.DateArrived,
            ISNumber = dto.ISNumber,
            TypeOfTest = dto.TypeOfTest,
            SampleSize = dto.SampleSize,
            ConditionOnReceiving = dto.ConditionOnReceiving,
            OtherRemarks = dto.OtherRemarks,
            AcceptanceStatus = "Pending",
            ProgressPercent = 0
        };

        _context.Samples.Add(sample);
        await _context.SaveChangesAsync();
    }

    private IQueryable<SampleDto> BaseSampleQuery()
    {
        return _context.Samples
            .Include(x => x.AssignedEmployee).ThenInclude(x => x.User)
            .Include(x => x.Customer)
            .Include(x => x.Requests)
            .Select(x => new SampleDto
            {
                Id = x.Id,
                RequestId = x.Requests.OrderByDescending(r => r.Id).Select(r => (int?)r.Id).FirstOrDefault(),
                SampleCode = x.SampleCode,
                SampleName = x.SampleName,
                SampleType = x.SampleType,
                CustomerId = x.CustomerId,
                CustomerOrBranchName = x.SampleType == "Government" ? x.BranchName : (x.Customer != null ? x.Customer.Name : null),
                CustomerOrBranchAddress = x.SampleType == "Government" ? x.BranchAddress : (x.Customer != null ? x.Customer.Address : null),
                Employee = x.AssignedEmployee.User.FullName,
                AssignedEmployeeId = x.AssignedEmployeeId,
                CurrentPhase = x.CurrentPhase,
                Status = x.Status,
                DateArrived = x.DateArrived,
                ISNumber = x.ISNumber,
                TypeOfTest = x.TypeOfTest,
                SampleSize = x.SampleSize,
                GeneratedCode = x.GeneratedCode,
                ProcessStartDate = x.ProcessStartDate,
                CompletionDate = x.CompletionDate,
                ConditionOnReceiving = x.ConditionOnReceiving,
                OtherRemarks = x.OtherRemarks,
                AcceptanceStatus = x.AcceptanceStatus,
                RejectionRemarks = x.RejectionRemarks,
                ExpectedCompletionDate = x.ExpectedCompletionDate,
                ProgressPercent = x.ProgressPercent
            });
    }

    public async Task<List<SampleDto>> GetSamples()
    {
        return await BaseSampleQuery().ToListAsync();
    }

    public async Task<List<SampleDto>> GetSamplesByType(string sampleType)
    {
        return await _context.Samples
            .Include(x => x.AssignedEmployee).ThenInclude(x => x.User)
            .Include(x => x.Customer)
            .Include(x => x.Requests)
            .Where(x => x.SampleType == sampleType)
            .Select(x => new SampleDto
            {
                Id = x.Id,
                RequestId = x.Requests.OrderByDescending(r => r.Id).Select(r => (int?)r.Id).FirstOrDefault(),
                SampleCode = x.SampleCode,
                SampleName = x.SampleName,
                SampleType = x.SampleType,
                CustomerId = x.CustomerId,
                CustomerOrBranchName = x.SampleType == "Government" ? x.BranchName : (x.Customer != null ? x.Customer.Name : null),
                CustomerOrBranchAddress = x.SampleType == "Government" ? x.BranchAddress : (x.Customer != null ? x.Customer.Address : null),
                Employee = x.AssignedEmployee.User.FullName,
                AssignedEmployeeId = x.AssignedEmployeeId,
                CurrentPhase = x.CurrentPhase,
                Status = x.Status,
                DateArrived = x.DateArrived,
                ISNumber = x.ISNumber,
                TypeOfTest = x.TypeOfTest,
                SampleSize = x.SampleSize,
                GeneratedCode = x.GeneratedCode,
                ProcessStartDate = x.ProcessStartDate,
                CompletionDate = x.CompletionDate,
                ConditionOnReceiving = x.ConditionOnReceiving,
                OtherRemarks = x.OtherRemarks,
                AcceptanceStatus = x.AcceptanceStatus,
                RejectionRemarks = x.RejectionRemarks,
                ExpectedCompletionDate = x.ExpectedCompletionDate,
                ProgressPercent = x.ProgressPercent
            })
            .ToListAsync();
    }

    public async Task<List<SampleDto>> GetSamplesByEmployee(int employeeId)
    {
        return await _context.Samples
            .Include(x => x.AssignedEmployee).ThenInclude(x => x.User)
            .Include(x => x.Customer)
            .Include(x => x.Requests)
            .Where(x => x.AssignedEmployeeId == employeeId)
            .Select(x => new SampleDto
            {
                Id = x.Id,
                RequestId = x.Requests.OrderByDescending(r => r.Id).Select(r => (int?)r.Id).FirstOrDefault(),
                SampleCode = x.SampleCode,
                SampleName = x.SampleName,
                SampleType = x.SampleType,
                CustomerId = x.CustomerId,
                CustomerOrBranchName = x.SampleType == "Government" ? x.BranchName : (x.Customer != null ? x.Customer.Name : null),
                CustomerOrBranchAddress = x.SampleType == "Government" ? x.BranchAddress : (x.Customer != null ? x.Customer.Address : null),
                Employee = x.AssignedEmployee.User.FullName,
                AssignedEmployeeId = x.AssignedEmployeeId,
                CurrentPhase = x.CurrentPhase,
                Status = x.Status,
                DateArrived = x.DateArrived,
                ISNumber = x.ISNumber,
                TypeOfTest = x.TypeOfTest,
                SampleSize = x.SampleSize,
                GeneratedCode = x.GeneratedCode,
                ProcessStartDate = x.ProcessStartDate,
                CompletionDate = x.CompletionDate,
                ConditionOnReceiving = x.ConditionOnReceiving,
                OtherRemarks = x.OtherRemarks,
                AcceptanceStatus = x.AcceptanceStatus,
                RejectionRemarks = x.RejectionRemarks,
                ExpectedCompletionDate = x.ExpectedCompletionDate,
                ProgressPercent = x.ProgressPercent
            })
            .ToListAsync();
    }

    public async Task RequestPhase(RequestPhaseDto dto)
    {
        var sample = await _context.Samples.FirstOrDefaultAsync(x => x.Id == dto.SampleId);
        if (sample == null) throw new Exception("Sample not found");

        TestingRequest request = new()
        {
            SampleId = sample.Id,
            EmployeeId = dto.EmployeeId,
            CurrentPhase = sample.CurrentPhase,
            RequestedPhase = dto.RequestedPhase,
            Status = "Pending"
        };

        _context.TestingRequests.Add(request);
        await _context.SaveChangesAsync();
    }

    public async Task ApproveRequest(int requestId)
    {
        var request = await _context.TestingRequests.Include(x => x.Sample).FirstOrDefaultAsync(x => x.Id == requestId);
        if (request == null) throw new Exception("Request not found");

        request.Status = "Approved";
        request.Sample.CurrentPhase = request.RequestedPhase;
        await _context.SaveChangesAsync();
    }

    public async Task RejectRequest(int requestId)
    {
        var request = await _context.TestingRequests.FirstOrDefaultAsync(x => x.Id == requestId);
        if (request == null) throw new Exception("Request not found");

        request.Status = "Rejected";
        await _context.SaveChangesAsync();
    }

    public async Task UpdateSampleDetails(int sampleId, UpdateSampleDetailsDto dto)
    {
        var sample = await _context.Samples.FirstOrDefaultAsync(x => x.Id == sampleId);
        if (sample == null) throw new Exception("Sample not found");

        if (dto.DateArrived.HasValue) sample.DateArrived = dto.DateArrived;
        if (dto.ISNumber != null) sample.ISNumber = dto.ISNumber;
        if (dto.TypeOfTest != null) sample.TypeOfTest = dto.TypeOfTest;
        if (dto.SampleSize != null) sample.SampleSize = dto.SampleSize;
        if (dto.GeneratedCode != null) sample.GeneratedCode = dto.GeneratedCode;
        if (dto.ProcessStartDate.HasValue) sample.ProcessStartDate = dto.ProcessStartDate;
        if (dto.CompletionDate.HasValue) sample.CompletionDate = dto.CompletionDate;
        if (dto.ConditionOnReceiving != null) sample.ConditionOnReceiving = dto.ConditionOnReceiving;
        if (dto.OtherRemarks != null) sample.OtherRemarks = dto.OtherRemarks;

        sample.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task AcceptSample(int sampleId, AcceptSampleDto dto)
    {
        var sample = await _context.Samples.FirstOrDefaultAsync(x => x.Id == sampleId);
        if (sample == null) throw new Exception("Sample not found");

        sample.AcceptanceStatus = "Accepted";
        sample.ExpectedCompletionDate = dto.ExpectedCompletionDate;
        sample.RejectionRemarks = null;
        sample.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task RejectSample(int sampleId, RejectSampleDto dto)
    {
        var sample = await _context.Samples.FirstOrDefaultAsync(x => x.Id == sampleId);
        if (sample == null) throw new Exception("Sample not found");

        sample.AcceptanceStatus = "Rejected";
        sample.RejectionRemarks = dto.Remarks;
        sample.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task AddProgress(AddProgressDto dto)
    {
        var sample = await _context.Samples.FirstOrDefaultAsync(x => x.Id == dto.SampleId);
        if (sample == null) throw new Exception("Sample not found");

        var clamped = Math.Max(0, Math.Min(100, dto.ProgressPercent));

        SampleProgressLog log = new()
        {
            SampleId = dto.SampleId,
            EmployeeId = dto.EmployeeId,
            ProgressPercent = clamped,
            Remarks = dto.Remarks,
            LoggedAt = DateTime.UtcNow
        };

        _context.SampleProgressLogs.Add(log);

        sample.ProgressPercent = clamped;
        sample.UpdatedAt = DateTime.UtcNow;
        if (clamped >= 100) sample.Status = "Completed";

        await _context.SaveChangesAsync();
    }

    public async Task<List<ProgressLogDto>> GetProgressLogs(int sampleId)
    {
        return await _context.SampleProgressLogs
            .Include(x => x.Employee).ThenInclude(x => x.User)
            .Where(x => x.SampleId == sampleId)
            .OrderByDescending(x => x.LoggedAt)
            .Select(x => new ProgressLogDto
            {
                Id = x.Id,
                ProgressPercent = x.ProgressPercent,
                Remarks = x.Remarks,
                Employee = x.Employee.User.FullName,
                LoggedAt = x.LoggedAt
            })
            .ToListAsync();
    }
}
