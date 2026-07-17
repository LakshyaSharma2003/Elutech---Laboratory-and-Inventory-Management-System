using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Sample : BaseEntity
{
    public string? SampleCode { get; set; }
    public string? SampleName { get; set; }

    // "Government" or "Private"
    public string? SampleType { get; set; }

    // Private samples link to a Customer. Government samples use BranchName/Address instead.
    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public string? BranchName { get; set; }
    public string? BranchAddress { get; set; }

    public int AssignedEmployeeId { get; set; }
    public Employee AssignedEmployee { get; set; }

    public string? CurrentPhase { get; set; }
    public string? Status { get; set; }

    public DateTime ReceivedDate { get; set; }

    // ── Extended intake fields ──
    public DateTime? DateArrived { get; set; }
    public string? ISNumber { get; set; }
    public string? TypeOfTest { get; set; }
    public string? SampleSize { get; set; }
    public string? GeneratedCode { get; set; }          // filled in later when received
    public DateTime? ProcessStartDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string? ConditionOnReceiving { get; set; }
    public string? OtherRemarks { get; set; }

    // ── Employee accept / reject workflow ──
    // Pending / Accepted / Rejected
    public string AcceptanceStatus { get; set; } = "Pending";
    public string? RejectionRemarks { get; set; }
    public DateTime? ExpectedCompletionDate { get; set; }

    // ── Progress tracking ──
    public int ProgressPercent { get; set; }

    public ICollection<TestingRequest> Requests { get; set; } = new List<TestingRequest>();
    public ICollection<SampleProgressLog> ProgressLogs { get; set; } = new List<SampleProgressLog>();
}
