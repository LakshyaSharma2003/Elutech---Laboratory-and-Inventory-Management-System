using EluTech.API.Data;
using EluTech.API.DTOs.Attendance;
using EluTech.API.Entities;
using EluTech.API.Interfaces;

using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;

namespace EluTech.API.Services;



public class AttendanceService
: IAttendanceService
{


    private readonly ApplicationDbContext
    _context;



    public AttendanceService(

    ApplicationDbContext context)
    {


        _context = context;

    }



    public async Task MarkAttendance(

    MarkAttendanceDto dto)
    {


        Attendance attendance = new()
        {


            EmployeeId = dto.EmployeeId,


            Date = DateTime.UtcNow.Date,


            CheckIn = dto.CheckIn,


            Status = dto.Status


        };



        _context.Attendances.Add(

        attendance);



        await _context.SaveChangesAsync();


    }





    public async Task<List<AttendanceDto>>

    GetAttendance()
    {


        return await _context.Attendances



        .Include(

        x => x.Employee)



        .ThenInclude(

        x => x.User)




        .Select(

        x => new AttendanceDto
        {


            Id = x.Id,


            EmployeeName =


        x.Employee.User.FullName,



            Date = x.Date,



            CheckIn = x.CheckIn,



            CheckOut = x.CheckOut,



            Status = x.Status


        }


        )



        .ToListAsync();


    }




    public async Task<List<AttendanceDto>>

    GetEmployeeAttendance(

    int employeeId)
    {


        return await _context.Attendances



        .Include(

        x => x.Employee)


        .ThenInclude(

        x => x.User)




        .Where(

        x => x.EmployeeId == employeeId)




        .Select(

        x => new AttendanceDto
        {


            Id = x.Id,


            EmployeeName =


        x.Employee.User.FullName,



            Date = x.Date,



            CheckIn = x.CheckIn,


            CheckOut = x.CheckOut,


            Status = x.Status


        }


        )



        .ToListAsync();



    }

    public async Task CheckOut(int attendanceId, DateTime checkOutTime)
    {


        var attendance = await _context.Attendances

        .FirstOrDefaultAsync(

        x => x.Id == attendanceId);



        if (attendance == null)
            throw new Exception(

            "Attendance not found");




        attendance.CheckOut = checkOutTime;



        await _context.SaveChangesAsync();


    }

    public async Task<List<AttendanceDto>>

GetTodayAttendance()
    {


        DateTime today =

        DateTime.UtcNow.Date;




        return await _context.Attendances



        .Include(

        x => x.Employee)


        .ThenInclude(

        x => x.User)



        .Where(

        x => x.Date == today)




        .Select(

        x => new AttendanceDto
        {


            Id = x.Id,


            EmployeeName =

        x.Employee.User.FullName,



            Date = x.Date,


            CheckIn = x.CheckIn,


            CheckOut = x.CheckOut,


            Status = x.Status


        }



        )


        .ToListAsync();



    }

    public async Task<AttendanceSummaryDto>

GetMonthlySummary()
    {


        var month = DateTime.UtcNow.Month;





        var data =

        await _context.Attendances


        .Where(

        x => x.Date.Month == month)


        .ToListAsync();





        AttendanceSummaryDto dto = new();



        dto.Present =

        data.Count(

        x => x.Status == "Present");



        dto.Absent =

        data.Count(

        x => x.Status == "Absent");



        dto.Leave =

        data.Count(

        x => x.Status == "Leave");




        dto.HalfDay =

        data.Count(

        x => x.Status == "HalfDay");



        dto.Total =

        data.Count;




        return dto;



    }

    public async Task<byte[]>

ExportAttendance()
    {


        var workbook =

        new XLWorkbook();




        var worksheet =

        workbook.Worksheets.Add(

        "Attendance"

        );



        worksheet.Cell(1, 1)

        .Value = "Name";


        worksheet.Cell(1, 2)

        .Value = "Date";


        worksheet.Cell(1, 3)

        .Value = "Status";





        var attendance =

        await _context.Attendances



        .Include(

        x => x.Employee)



        .ThenInclude(

        x => x.User)




        .ToListAsync();




        int row = 2;




        foreach (var item in attendance)
        {


            worksheet.Cell(row, 1)

            .Value =

            item.Employee.User.FullName;



            worksheet.Cell(row, 2)

            .Value =

            item.Date;




            worksheet.Cell(row, 3)

            .Value =

            item.Status;




            row++;


        }





        using var stream =

        new MemoryStream();




        workbook.SaveAs(

        stream);



        return stream.ToArray();



    }
}