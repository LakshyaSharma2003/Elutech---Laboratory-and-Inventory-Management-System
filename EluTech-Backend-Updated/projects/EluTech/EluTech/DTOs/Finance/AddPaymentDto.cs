namespace EluTech.API.DTOs.Finance;

public class AddPaymentDto
{
    public int CustomerId { get; set; }

    public decimal Amount { get; set; }

    public string? PaymentMethod { get; set; }

    public string? ReferenceNumber { get; set; }
}