using Asp.Versioning;
using EluTech.API.DTOs.Inventory;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
[Authorize(Policy = "ManagerOnly")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;

    public InventoryController(IInventoryService service)
    {
        _service = service;
    }

    [HttpPost("chemical")]
    public async Task<IActionResult> AddChemical(AddChemicalDto dto)
    {
        await _service.AddChemical(dto);
        return Ok();
    }

    [HttpPost("machinery")]
    public async Task<IActionResult> AddMachinery(AddMachineryDto dto)
    {
        await _service.AddMachinery(dto);
        return Ok();
    }

    [HttpPost("consumable")]
    public async Task<IActionResult> AddConsumable(AddConsumableDto dto)
    {
        await _service.AddConsumable(dto);
        return Ok();
    }

    [HttpPost("purchase")]
    public async Task<IActionResult> AddPurchase(PurchaseDto dto)
    {
        await _service.AddPurchase(dto);
        return Ok();
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> LowStock() => Ok(await _service.GetLowStockChemicals());

    [HttpGet("expiring")]
    public async Task<IActionResult> Expiring() => Ok(await _service.GetExpiringChemicals());

    [HttpGet("chemicals")]
    public async Task<IActionResult> GetChemicals() => Ok(await _service.GetAllChemicals());

    [HttpGet("machinery")]
    public async Task<IActionResult> GetMachinery() => Ok(await _service.GetAllMachinery());

    [HttpGet("consumables")]
    public async Task<IActionResult> GetConsumables() => Ok(await _service.GetAllConsumables());

    [HttpGet("purchases")]
    public async Task<IActionResult> GetPurchases() => Ok(await _service.GetAllPurchases());

    // Restock — optionally add quantity, always clears low-stock & expiry alerts
    [HttpPut("chemical/{id}/restock")]
    public async Task<IActionResult> Restock(int id, RestockChemicalDto dto)
    {
        await _service.RestockChemical(id, dto);
        return Ok(new { Message = "Chemical marked as restocked" });
    }

    // Mute a low-stock alert without changing quantity (e.g. "already ordered")
    [HttpPut("chemical/{id}/dismiss-low-stock")]
    public async Task<IActionResult> DismissLowStock(int id)
    {
        await _service.DismissLowStock(id);
        return Ok(new { Message = "Low stock alert dismissed" });
    }

    // Mute an expiry alert without any stock change
    [HttpPut("chemical/{id}/dismiss-expiry")]
    public async Task<IActionResult> DismissExpiry(int id)
    {
        await _service.DismissExpiry(id);
        return Ok(new { Message = "Expiry alert dismissed" });
    }

    [HttpDelete("chemical/{id}")]
    public async Task<IActionResult> DeleteChemical(int id)
    {
        await _service.DeleteChemical(id);
        return Ok(new { Message = "Chemical removed" });
    }

    [HttpDelete("machinery/{id}")]
    public async Task<IActionResult> DeleteMachinery(int id)
    {
        await _service.DeleteMachinery(id);
        return Ok(new { Message = "Machinery removed" });
    }

    [HttpDelete("consumable/{id}")]
    public async Task<IActionResult> DeleteConsumable(int id)
    {
        await _service.DeleteConsumable(id);
        return Ok(new { Message = "Consumable removed" });
    }
}
