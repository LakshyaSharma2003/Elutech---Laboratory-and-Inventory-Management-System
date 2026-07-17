using EluTech.API.Common;

namespace EluTech.API.Entities;

// Self-reported check-in/out by the employee. This is a REFERENCE for the
// Manager only — it does NOT mark official attendance. The Manager still
// marks attendance manually using the existing Attendance workflow.
public class EmployeeCheckLog : BaseEntity
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; }

    public DateTime Date { get; set; }

    public DateTime? SelfCheckIn { get; set; }
    public DateTime? SelfCheckOut { get; set; }
}
