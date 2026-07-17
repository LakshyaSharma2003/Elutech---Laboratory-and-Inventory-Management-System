namespace EluTech.API.DTOs.Sample;

public class AddProgressDto
{
    public int SampleId { get; set; }
    public int EmployeeId { get; set; }
    public int ProgressPercent { get; set; }
    public string? Remarks { get; set; }
}
