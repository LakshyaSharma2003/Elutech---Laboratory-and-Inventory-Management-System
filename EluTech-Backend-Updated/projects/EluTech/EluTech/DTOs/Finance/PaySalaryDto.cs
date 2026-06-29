namespace EluTech.API.DTOs.Finance;

public class PaySalaryDto
{
    public int EmployeeId { get; set; }

    public decimal Amount { get; set; }

    public string? Month { get; set; }
}