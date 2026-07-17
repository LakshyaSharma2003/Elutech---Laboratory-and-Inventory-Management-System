namespace EluTech.API.DTOs.Sample;

// PATCH-style — only non-null fields are applied. Lets the Manager/Employee
// fill in details that weren't available at intake time.
public class UpdateSampleDetailsDto
{
    public DateTime? DateArrived { get; set; }
    public string? ISNumber { get; set; }
    public string? TypeOfTest { get; set; }
    public string? SampleSize { get; set; }
    public string? GeneratedCode { get; set; }
    public DateTime? ProcessStartDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string? ConditionOnReceiving { get; set; }
    public string? OtherRemarks { get; set; }
}
