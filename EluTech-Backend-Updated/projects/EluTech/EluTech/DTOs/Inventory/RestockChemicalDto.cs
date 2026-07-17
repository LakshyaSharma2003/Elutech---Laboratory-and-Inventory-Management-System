namespace EluTech.API.DTOs.Inventory;

public class RestockChemicalDto
{
    // Quantity to ADD to current stock (optional — leave 0 to just clear alerts)
    public int AddedQuantity { get; set; }
}
