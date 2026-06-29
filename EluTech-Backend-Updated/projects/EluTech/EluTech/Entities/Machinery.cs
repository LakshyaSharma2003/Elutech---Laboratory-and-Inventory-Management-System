using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Machinery : BaseEntity
{

    public string? MachineName { get; set; }

    public string? Manufacturer { get; set; }

    public string? SerialNumber { get; set; }

    public DateTime PurchaseDate { get; set; }

    public DateTime LastMaintenance { get; set; }

    public bool IsActive { get; set; }


}