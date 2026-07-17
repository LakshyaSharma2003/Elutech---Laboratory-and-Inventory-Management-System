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

    // Employee self-reported check-in/out — reference only, does NOT mark official attendance
    Task<EmployeeCheckLogDto> SelfCheckIn(int employeeId);
    Task<EmployeeCheckLogDto> SelfCheckOut(int employeeId);
    Task<List<EmployeeCheckLogDto>> GetTodaySelfCheckLogs();

    // Lets the employee's own dashboard know if they've already checked in/out today
    Task<EmployeeCheckLogDto?> GetMyTodayStatus(int employeeId);
}