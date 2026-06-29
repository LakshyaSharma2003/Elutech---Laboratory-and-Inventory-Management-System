using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Payment : BaseEntity
{

    public int CustomerId { get; set; }

    public Customer Customer { get; set; }



    public decimal Amount { get; set; }



    public DateTime PaymentDate { get; set; }



    public string? PaymentMethod { get; set; }



    public string? Status { get; set; }



    public string? ReferenceNumber { get; set; }

}