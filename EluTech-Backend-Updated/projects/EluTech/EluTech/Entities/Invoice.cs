using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Invoice : BaseEntity
{

    public string? InvoiceNumber { get; set; }

    public int CustomerId { get; set; }

    public Customer Customer { get; set; }



    public decimal SubTotal { get; set; }



    public decimal GST { get; set; }



    public decimal TotalAmount { get; set; }



    public DateTime InvoiceDate { get; set; }



    public DateTime DueDate { get; set; }



    public bool IsPaid { get; set; }



    public string? Notes { get; set; }

}