using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Report : BaseEntity
{
    public int SampleId { get; set; }
    public Sample Sample { get; set; }

    public int EmployeeId { get; set; }
    public Employee Employee { get; set; }

    public string? ReportNumber { get; set; }

    public string? FileName { get; set; }
    public string? FilePath { get; set; }

    public int Version { get; set; }

    public bool IsApproved { get; set; }

    public string? Status { get; set; }

    public string? Remarks { get; set; }

    public string? ManagerRemarks { get; set; }
}
