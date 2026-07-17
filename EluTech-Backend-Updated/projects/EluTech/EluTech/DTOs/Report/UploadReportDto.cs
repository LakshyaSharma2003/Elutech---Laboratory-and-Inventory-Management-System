namespace EluTech.API.DTOs.Report;

public class UploadReportDto
{
    public int SampleId { get; set; }
    public int EmployeeId { get; set; }
    public string ReportNumber { get; set; }
    public string? Remarks { get; set; }
}
