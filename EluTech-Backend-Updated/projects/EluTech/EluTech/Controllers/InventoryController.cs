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


    public InventoryController(
        IInventoryService service)
    {
        _service = service;
    }


    [HttpPost("chemical")]
    public async Task<IActionResult>
        AddChemical(AddChemicalDto dto)
    {
        await _service.AddChemical(dto);

        return Ok();
    }


    [HttpPost("machinery")]
    public async Task<IActionResult>
        AddMachinery(AddMachineryDto dto)
    {
        await _service.AddMachinery(dto);

        return Ok();
    }



    [HttpPost("consumable")]
    public async Task<IActionResult>
        AddConsumable(AddConsumableDto dto)
    {
        await _service.AddConsumable(dto);

        return Ok();
    }



    [HttpPost("purchase")]
    public async Task<IActionResult>
        AddPurchase(PurchaseDto dto)
    {
        await _service.AddPurchase(dto);

        return Ok();
    }



    [HttpGet("low-stock")]
    public async Task<IActionResult>
        LowStock()
    {

        return Ok(

            await _service.GetLowStockChemicals()

        );

    }



    // Get ALL chemicals (not just low stock)
    [HttpGet("chemicals")]
    public async Task<IActionResult> GetChemicals()
    {
        return Ok(await _service.GetAllChemicals());
    }

    // Get all machinery
    [HttpGet("machinery")]
    public async Task<IActionResult> GetMachinery()
    {
        return Ok(await _service.GetAllMachinery());
    }

    // Get all consumables
    [HttpGet("consumables")]
    public async Task<IActionResult> GetConsumables()
    {
        return Ok(await _service.GetAllConsumables());
    }

    // Get all purchases
    [HttpGet("purchases")]
    public async Task<IActionResult> GetPurchases()
    {
        return Ok(await _service.GetAllPurchases());
    }

}