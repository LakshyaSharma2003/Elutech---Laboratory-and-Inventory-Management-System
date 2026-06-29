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


    public ReportService(
        ApplicationDbContext context,
        IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }



    public async Task UploadReport(
        IFormFile file,
        UploadReportDto dto)
    {

        if (file == null)
            throw new Exception("File not found");


        string folder = Path.Combine(
            _env.WebRootPath ?? "wwwroot",
            "Reports");


        Directory.CreateDirectory(folder);



        string savedFileName =
            Guid.NewGuid().ToString()

            +

            Path.GetExtension(
                file.FileName);




        string fullPath =
            Path.Combine(
                folder,
                savedFileName);



        using (var stream =
               new FileStream(
                   fullPath,
                   FileMode.Create))
        {

            await file.CopyToAsync(stream);

        }



        int version =

            await _context.Reports

            .CountAsync(

            x => x.SampleId == dto.SampleId)

            + 1;





        Report report = new()
        {

            SampleId = dto.SampleId,


            EmployeeId = dto.EmployeeId,


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






    public async Task<List<ReportDto>>
        GetReports()
    {


        return await _context.Reports


            .Include(

            x => x.Sample)



            .Include(

            x => x.Employee)



            .ThenInclude(

            x => x.User)




            .Select(

            x => new ReportDto
            {


                Id = x.Id,



                Sample =
                    x.Sample.SampleName,



                Employee =
                    x.Employee.User.FullName,



                Version =
                    x.Version,



                Approved =
                    x.IsApproved,



                Status =
                    x.Status,



                FileName =
                    x.FileName


            })


            .ToListAsync();



    }







    public async Task<byte[]>
        DownloadReport(
            int id)
    {


        var report =

            await _context.Reports


            .FirstOrDefaultAsync(

            x => x.Id == id);




        if (report == null)
            throw new Exception(
                "Report not found");




        return await File.ReadAllBytesAsync(

            report.FilePath);



    }








    public async Task ApproveReport(
        int id)
    {


        var report =

            await _context.Reports


            .FirstOrDefaultAsync(

            x => x.Id == id);




        if (report == null)
            throw new Exception(
                "Report not found");



        report.IsApproved = true;



        report.Status = "Approved";



        report.UpdatedAt =
            DateTime.UtcNow;



        await _context.SaveChangesAsync();



    }








    public async Task RejectReport(
        int id)
    {


        var report =

            await _context.Reports


            .FirstOrDefaultAsync(

            x => x.Id == id);




        if (report == null)
            throw new Exception(
                "Report not found");



        report.IsApproved = false;



        report.Status = "Rejected";



        report.UpdatedAt =
            DateTime.UtcNow;



        await _context.SaveChangesAsync();



    }


}