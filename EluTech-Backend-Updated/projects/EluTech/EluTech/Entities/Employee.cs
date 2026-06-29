using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Employee : BaseEntity
{

    public int UserId { get; set; }

    public User User { get; set; }


    public string? Designation { get; set; }


    public string? Department { get; set; }


    public decimal Salary { get; set; }


    public DateTime JoiningDate { get; set; }


    public bool IsTerminated { get; set; }


    public DateTime? TerminatedDate { get; set; }

    public ICollection<Attendance> Attendances
    {
        get;
        set;
    }
=
new List<Attendance>();
}