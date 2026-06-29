namespace EluTech.API.DTOs.Finance;

public class AddExpenseDto
{
    public string? Title { get; set; }

    public decimal Amount { get; set; }

    public string? Category { get; set; }

    public string? Description { get; set; }
}