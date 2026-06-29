namespace EluTech.API.DTOs.Attendance;


public class MarkAttendanceDto
{

    public int EmployeeId { get; set; }


    public DateTime CheckIn { get; set; }


    public string? Status { get; set; }


}