namespace EluTech.API.DTOs.Attendance;


public class AttendanceDto
{

    public int Id { get; set; }



    public string? EmployeeName { get; set; }



    public DateTime Date { get; set; }



    public DateTime CheckIn { get; set; }



    public DateTime? CheckOut { get; set; }



    public string? Status { get; set; }


}