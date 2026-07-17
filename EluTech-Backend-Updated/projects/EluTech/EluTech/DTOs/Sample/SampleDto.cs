namespace EluTech.API.DTOs.Sample;

public class SampleDto
{
    public int Id { get; set; }
    public int? RequestId { get; set; }
    public string? SampleCode { get; set; }
    public string? SampleName { get; set; }
    public string? SampleType { get; set; }

    public int? CustomerId { get; set; }
    public string? CustomerOrBranchName { get; set; }
    public string? CustomerOrBranchAddress { get; set; }

    public string? Employee { get; set; }
    public int AssignedEmployeeId { get; set; }
    public string? CurrentPhase { get; set; }
    public string? Status { get; set; }

    public DateTime? DateArrived { get; set; }
    public string? ISNumber { get; set; }
    public string? TypeOfTest { get; set; }
    public string? SampleSize { get; set; }
    public string? GeneratedCode { get; set; }
    public DateTime? ProcessStartDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string? ConditionOnReceiving { get; set; }
    public string? OtherRemarks { get; set; }

    public string AcceptanceStatus { get; set; }
    public string? RejectionRemarks { get; set; }
    public DateTime? ExpectedCompletionDate { get; set; }
    public int ProgressPercent { get; set; }
}
