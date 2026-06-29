namespace EluTech.API.DTOs.Attendance;

public class AttendanceSummaryDto
{
    public int Present { get; set; }

    public int Absent { get; set; }

    public int Leave { get; set; }

    public int HalfDay { get; set; }

    public int Total { get; set; }
}