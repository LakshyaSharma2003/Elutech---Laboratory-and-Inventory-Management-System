using Asp.Versioning;
using EluTech.API.Data;
using EluTech.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class CustomerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CustomerController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET all customers - accessible by Manager and FinanceOfficer
    [Authorize(Policy = "FinanceOnly")]
    [HttpGet]
    public async Task<IActionResult> GetCustomers()
    {
        var customers = await _context.Customers
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Email,
                c.PhoneNumber,
                c.Address,
                c.GSTNumber
            })
            .ToListAsync();

        return Ok(customers);
    }

    // POST create customer - Manager and FinanceOfficer
    [Authorize(Policy = "FinanceOnly")]
    [HttpPost]
    public async Task<IActionResult> AddCustomer([FromBody] AddCustomerRequest dto)
    {
        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            GSTNumber = dto.GSTNumber
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Customer added successfully", Id = customer.Id });
    }
}

public class AddCustomerRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string GSTNumber { get; set; }
}
