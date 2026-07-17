using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Chemical : BaseEntity
{
    public string? Name { get; set; }
    public string? CASNumber { get; set; }
    public int Quantity { get; set; }
    public string? Unit { get; set; }
    public int MinimumStock { get; set; }
    public DateTime ExpiryDate { get; set; }

    // Dismissal / restock tracking
    public bool LowStockDismissed { get; set; }
    public bool ExpiryDismissed { get; set; }
    public DateTime? LastRestockedAt { get; set; }
}
