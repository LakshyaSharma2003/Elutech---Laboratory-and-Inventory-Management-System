using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Consumable : BaseEntity
{

    public string? Name { get; set; }

    public int Quantity { get; set; }

    public int MinimumStock { get; set; }

    public string? Unit { get; set; }

}