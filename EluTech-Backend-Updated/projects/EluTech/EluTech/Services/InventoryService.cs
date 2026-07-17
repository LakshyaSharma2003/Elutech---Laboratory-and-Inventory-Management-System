using EluTech.API.Data;
using EluTech.API.DTOs.Inventory;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class InventoryService : IInventoryService
{
    private readonly ApplicationDbContext _context;

    public InventoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddChemical(AddChemicalDto dto)
    {
        Chemical chemical = new()
        {
            Name = dto.Name,
            CASNumber = dto.CASNumber,
            Quantity = dto.Quantity,
            Unit = dto.Unit,
            MinimumStock = dto.MinimumStock,
            ExpiryDate = dto.ExpiryDate,
            LowStockDismissed = false,
            ExpiryDismissed = false
        };

        _context.Chemicals.Add(chemical);
        await _context.SaveChangesAsync();
    }

    public async Task AddMachinery(AddMachineryDto dto)
    {
        Machinery machine = new()
        {
            MachineName = dto.MachineName,
            Manufacturer = dto.Manufacturer,
            SerialNumber = dto.SerialNumber,
            PurchaseDate = DateTime.UtcNow,
            LastMaintenance = DateTime.UtcNow,
            IsActive = true
        };

        _context.Machineries.Add(machine);
        await _context.SaveChangesAsync();
    }

    public async Task AddConsumable(AddConsumableDto dto)
    {
        Consumable item = new()
        {
            Name = dto.Name,
            Quantity = dto.Quantity,
            MinimumStock = dto.MinimumStock,
            Unit = dto.Unit
        };

        _context.Consumables.Add(item);
        await _context.SaveChangesAsync();
    }

    public async Task AddPurchase(PurchaseDto dto)
    {
        Purchase purchase = new()
        {
            ItemName = dto.ItemName,
            Amount = dto.Amount,
            Vendor = dto.Vendor,
            PurchaseDate = DateTime.UtcNow
        };

        _context.Purchases.Add(purchase);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Chemical>> GetLowStockChemicals()
    {
        return await _context.Chemicals
            .Where(x => x.Quantity <= x.MinimumStock && !x.IsDeleted && !x.LowStockDismissed)
            .ToListAsync();
    }

    public async Task<List<Chemical>> GetExpiringChemicals()
    {
        var cutoff = DateTime.UtcNow.AddDays(30);
        return await _context.Chemicals
            .Where(x => x.ExpiryDate <= cutoff && !x.IsDeleted && !x.ExpiryDismissed)
            .ToListAsync();
    }

    public async Task<List<Chemical>> GetAllChemicals()
    {
        return await _context.Chemicals.OrderBy(x => x.Name).ToListAsync();
    }

    public async Task<List<Machinery>> GetAllMachinery()
    {
        return await _context.Machineries.OrderByDescending(x => x.Id).ToListAsync();
    }

    public async Task<List<Consumable>> GetAllConsumables()
    {
        return await _context.Consumables.OrderBy(x => x.Name).ToListAsync();
    }

    public async Task<List<Purchase>> GetAllPurchases()
    {
        return await _context.Purchases.OrderByDescending(x => x.PurchaseDate).ToListAsync();
    }

    public async Task RestockChemical(int id, RestockChemicalDto dto)
    {
        var chemical = await _context.Chemicals.FirstOrDefaultAsync(x => x.Id == id);
        if (chemical == null) throw new Exception("Chemical not found");

        if (dto.AddedQuantity > 0)
            chemical.Quantity += dto.AddedQuantity;

        chemical.LowStockDismissed = false;
        chemical.ExpiryDismissed = false;
        chemical.LastRestockedAt = DateTime.UtcNow;
        chemical.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task DismissLowStock(int id)
    {
        var chemical = await _context.Chemicals.FirstOrDefaultAsync(x => x.Id == id);
        if (chemical == null) throw new Exception("Chemical not found");
        chemical.LowStockDismissed = true;
        chemical.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task DismissExpiry(int id)
    {
        var chemical = await _context.Chemicals.FirstOrDefaultAsync(x => x.Id == id);
        if (chemical == null) throw new Exception("Chemical not found");
        chemical.ExpiryDismissed = true;
        chemical.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteChemical(int id)
    {
        var chemical = await _context.Chemicals.FirstOrDefaultAsync(x => x.Id == id);
        if (chemical == null) throw new Exception("Chemical not found");
        chemical.IsDeleted = true;
        chemical.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteMachinery(int id)
    {
        var m = await _context.Machineries.FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) throw new Exception("Machinery not found");
        m.IsDeleted = true;
        m.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteConsumable(int id)
    {
        var c = await _context.Consumables.FirstOrDefaultAsync(x => x.Id == id);
        if (c == null) throw new Exception("Consumable not found");
        c.IsDeleted = true;
        c.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
}
