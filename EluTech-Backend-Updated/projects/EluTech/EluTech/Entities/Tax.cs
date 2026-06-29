using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Tax : BaseEntity
{


    public string? TaxName { get; set; }



    public decimal Amount { get; set; }



    public DateTime TaxDate { get; set; }



}