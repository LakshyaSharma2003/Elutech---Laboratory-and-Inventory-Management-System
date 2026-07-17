namespace EluTech.API.DTOs.Attendance;

public class EmployeeCheckLogDto
{
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public DateTime Date { get; set; }
    public DateTime? SelfCheckIn { get; set; }
    public DateTime? SelfCheckOut { get; set; }
}
