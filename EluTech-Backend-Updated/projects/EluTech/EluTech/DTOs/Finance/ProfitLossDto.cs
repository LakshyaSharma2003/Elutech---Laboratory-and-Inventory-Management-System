namespace EluTech.API.DTOs.Finance;

public class ProfitLossDto
{
    public decimal Revenue { get; set; }

    public decimal Expenses { get; set; }

    public decimal Salaries { get; set; }

    public decimal Taxes { get; set; }

    public decimal Profit { get; set; }
}