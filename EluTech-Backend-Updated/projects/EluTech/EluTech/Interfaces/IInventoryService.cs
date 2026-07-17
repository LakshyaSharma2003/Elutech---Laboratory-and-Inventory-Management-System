using EluTech.API.DTOs.Inventory;
using EluTech.API.Entities;

namespace EluTech.API.Interfaces;

public interface IInventoryService
{
    Task AddChemical(AddChemicalDto dto);
    Task AddMachinery(AddMachineryDto dto);
    Task AddConsumable(AddConsumableDto dto);
    Task AddPurchase(PurchaseDto dto);

    Task<List<Chemical>> GetLowStockChemicals();
    Task<List<Chemical>> GetExpiringChemicals();

    Task<List<Chemical>> GetAllChemicals();
    Task<List<Machinery>> GetAllMachinery();
    Task<List<Consumable>> GetAllConsumables();
    Task<List<Purchase>> GetAllPurchases();

    Task RestockChemical(int id, RestockChemicalDto dto);
    Task DismissLowStock(int id);
    Task DismissExpiry(int id);

    Task DeleteChemical(int id);
    Task DeleteMachinery(int id);
    Task DeleteConsumable(int id);
}
