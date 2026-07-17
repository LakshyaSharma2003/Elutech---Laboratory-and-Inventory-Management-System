using EluTech.API.Common;

namespace EluTech.API.Entities;

public class SampleProgressLog : BaseEntity
{
    public int SampleId { get; set; }
    public Sample Sample { get; set; }

    public int EmployeeId { get; set; }
    public Employee Employee { get; set; }

    public int ProgressPercent { get; set; }
    public string? Remarks { get; set; }
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}
