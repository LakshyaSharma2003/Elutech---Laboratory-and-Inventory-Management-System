using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Salary : BaseEntity
{


    public int EmployeeId { get; set; }



    public Employee Employee { get; set; }



    public decimal Amount { get; set; }



    public DateTime PaidDate { get; set; }



    public string? Month { get; set; }



    public bool IsPaid { get; set; }



}