namespace EluTech.API.DTOs.Finance;

public class GenerateInvoiceDto
{

    public int CustomerId { get; set; }


    public decimal Amount { get; set; }


    public decimal GSTPercentage { get; set; }


    public string? Notes { get; set; }

}