namespace EluTech.API.DTOs.Inventory;

public class AddConsumableDto
{

    public string? Name { get; set; }

    public int Quantity { get; set; }

    public int MinimumStock { get; set; }

    public string? Unit { get; set; }

}