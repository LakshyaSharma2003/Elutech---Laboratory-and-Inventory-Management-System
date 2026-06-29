namespace EluTech.API.DTOs.Finance;

public class InvoiceDto
{

    public int Id { get; set; }


    public string? InvoiceNumber { get; set; }


    public string? Customer { get; set; }


    public decimal TotalAmount { get; set; }


    public DateTime InvoiceDate { get; set; }


    public bool IsPaid { get; set; }

}