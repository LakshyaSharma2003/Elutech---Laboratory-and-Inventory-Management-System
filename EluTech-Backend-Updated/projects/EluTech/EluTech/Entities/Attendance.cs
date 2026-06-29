using EluTech.API.Common;

namespace EluTech.API.Entities;


public class Attendance : BaseEntity
{


    public int EmployeeId { get; set; }


    public Employee Employee { get; set; }




    public DateTime Date { get; set; }




    public DateTime CheckIn { get; set; }




    public DateTime? CheckOut { get; set; }




    public string? Status { get; set; }



}