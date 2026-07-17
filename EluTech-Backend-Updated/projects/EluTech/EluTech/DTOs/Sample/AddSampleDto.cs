namespace EluTech.API.DTOs.Sample;

public class AddSampleDto
{
    public string SampleName { get; set; }

    // "Government" or "Private"
    public string SampleType { get; set; } = "Private";

    // Private only
    public int? CustomerId { get; set; }

    // Government only
    public string? BranchName { get; set; }
    public string? BranchAddress { get; set; }

    public int AssignedEmployeeId { get; set; }

    public DateTime? DateArrived { get; set; }
    public string? ISNumber { get; set; }
    public string? TypeOfTest { get; set; }
    public string? SampleSize { get; set; }
    public string? ConditionOnReceiving { get; set; }
    public string? OtherRemarks { get; set; }
}
