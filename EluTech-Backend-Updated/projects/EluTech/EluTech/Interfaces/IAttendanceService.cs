using EluTech.API.DTOs.Attendance;


namespace EluTech.API.Interfaces;


public interface IAttendanceService
{


    Task MarkAttendance(

    MarkAttendanceDto dto);




    Task<List<AttendanceDto>>

    GetAttendance();




    Task<List<AttendanceDto>>

    GetEmployeeAttendance(

    int employeeId);


    Task CheckOut(int attendanceId, DateTime checkOutTime);


    Task<List<AttendanceDto>>
    GetTodayAttendance();


    Task<AttendanceSummaryDto>
    GetMonthlySummary();

    Task<byte[]> ExportAttendance();
}