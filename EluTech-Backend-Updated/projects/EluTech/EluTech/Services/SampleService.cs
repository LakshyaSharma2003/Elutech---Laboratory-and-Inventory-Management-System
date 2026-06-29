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
            SampleCode = Guid.NewGuid()
                            .ToString()
                            .Substring(0, 8),

            SampleName = dto.SampleName,

            CustomerId = dto.CustomerId,

            AssignedEmployeeId = dto.AssignedEmployeeId,

            CurrentPhase = "Received",

            Status = "Active",

            ReceivedDate = DateTime.UtcNow
        };


        _context.Samples.Add(sample);

        await _context.SaveChangesAsync();
    }



    public async Task<List<SampleDto>> GetSamples()
    {
        return await _context.Samples


            .Include(x => x.AssignedEmployee)
                .ThenInclude(x => x.User)


            .Include(x => x.Requests)


            .Select(x => new SampleDto
            {
                Id = x.Id,


                RequestId = x.Requests


                    .OrderByDescending(r => r.Id)


                    .Select(r => (int?)r.Id)


                    .FirstOrDefault(),



                SampleCode = x.SampleCode,


                SampleName = x.SampleName,


                Employee = x.AssignedEmployee.User.FullName,


                CurrentPhase = x.CurrentPhase,


                Status = x.Status

            })


            .ToListAsync();
    }




    public async Task RequestPhase(RequestPhaseDto dto)
    {

        var sample = await _context.Samples

            .FirstOrDefaultAsync(

                x => x.Id == dto.SampleId
            );


        if (sample == null)
            throw new Exception("Sample not found");



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

        var request = await _context.TestingRequests


            .Include(x => x.Sample)


            .FirstOrDefaultAsync(

                x => x.Id == requestId
            );



        if (request == null)
            throw new Exception("Request not found");



        request.Status = "Approved";


        request.Sample.CurrentPhase =
            request.RequestedPhase;



        await _context.SaveChangesAsync();
    }




    public async Task RejectRequest(int requestId)
    {

        var request = await _context.TestingRequests


            .FirstOrDefaultAsync(

                x => x.Id == requestId
            );



        if (request == null)
            throw new Exception("Request not found");



        request.Status = "Rejected";



        await _context.SaveChangesAsync();
    }



    public async Task<List<SampleDto>> GetSamplesByEmployee(int employeeId)
    {
        return await _context.Samples

            .Include(x => x.AssignedEmployee)
                .ThenInclude(x => x.User)

            .Include(x => x.Requests)

            .Where(x => x.AssignedEmployeeId == employeeId)

            .Select(x => new SampleDto
            {
                Id = x.Id,

                RequestId = x.Requests
                    .OrderByDescending(r => r.Id)
                    .Select(r => (int?)r.Id)
                    .FirstOrDefault(),

                SampleCode = x.SampleCode,

                SampleName = x.SampleName,

                Employee = x.AssignedEmployee.User.FullName,

                CurrentPhase = x.CurrentPhase,

                Status = x.Status
            })

            .ToListAsync();
    }

}