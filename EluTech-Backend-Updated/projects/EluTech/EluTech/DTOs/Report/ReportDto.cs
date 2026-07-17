namespace EluTech.API.DTOs.Report;

public class ReportDto
{
    public int Id { get; set; }
    public int SampleId { get; set; }
    public int EmployeeUserId { get; set; }
    public string? ReportNumber { get; set; }
    public string? Sample { get; set; }
    public string? Employee { get; set; }
    public int Version { get; set; }
    public bool Approved { get; set; }
    public string? Status { get; set; }
    public string? FileName { get; set; }
    public string? Remarks { get; set; }
    public string? ManagerRemarks { get; set; }
}
