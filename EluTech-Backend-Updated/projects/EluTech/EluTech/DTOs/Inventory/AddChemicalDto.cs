namespace EluTech.API.DTOs.Inventory;

public class AddChemicalDto
{
    public string? Name { get; set; }

    public string? CASNumber { get; set; }

    public int Quantity { get; set; }

    public string? Unit { get; set; }

    public int MinimumStock { get; set; }

    public DateTime ExpiryDate { get; set; }
}