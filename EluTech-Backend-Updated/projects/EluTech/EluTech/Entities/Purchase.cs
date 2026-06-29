using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Purchase : BaseEntity
{

    public string? ItemName { get; set; }

    public decimal Amount { get; set; }

    public DateTime PurchaseDate { get; set; }

    public string? Vendor { get; set; }

}