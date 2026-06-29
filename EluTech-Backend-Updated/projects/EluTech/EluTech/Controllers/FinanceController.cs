using Asp.Versioning;
using EluTech.API.DTOs.Finance;
using EluTech.API.Interfaces;
using EluTech.API.DTOs.Employee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;


[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
[Authorize(Policy = "FinanceOnly")]

public class FinanceController
: ControllerBase
{

    private readonly IFinanceService _service;
    private readonly IEmployeeService _employeeService;


    public FinanceController(
        IFinanceService service,
        IEmployeeService employeeService)
    {

        _service = service;
        _employeeService = employeeService;
    }


    [HttpPost("payment")]
    public async Task<IActionResult>
    Payment(AddPaymentDto dto)
    {

        await _service.AddPayment(dto);

        return Ok();

    }



    [HttpPost("expense")]
    public async Task<IActionResult>
    Expense(AddExpenseDto dto)
    {

        await _service.AddExpense(dto);

        return Ok();

    }



    [HttpPost("salary")]
    public async Task<IActionResult>
    Salary(PaySalaryDto dto)
    {

        await _service.PaySalary(dto);

        return Ok();

    }



    [HttpPost("tax")]
    public async Task<IActionResult>
    Tax(TaxDto dto)
    {

        await _service.AddTax(dto);

        return Ok();

    }



    [HttpGet("profit-loss")]
    public async Task<IActionResult>
    ProfitLoss()
    {

        return Ok(

        await _service.GetProfitLoss()

        );

    }

    [HttpPost(

"invoice"

)]


    public async Task<IActionResult>

Invoice(

GenerateInvoiceDto dto)
    {


        await _service.GenerateInvoice(

        dto);



        return Ok();


    }

    [HttpGet(

"invoices"

)]


    public async Task<IActionResult>

Invoices()
    {


        return Ok(

        await _service.GetInvoices()

        );


    }

    [HttpGet(

"invoice/{id}"

)]


    public async Task<IActionResult>

Download(

int id)
    {


        var pdf =


        await _service.DownloadInvoice(

        id);




        return File(

        pdf,


        "application/pdf",



        $"Invoice_{id}.pdf"


        );



    }

    // Get employees for salary payment dropdown
    [HttpGet("employees")]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _employeeService.GetEmployees();
        return Ok(employees);
    }

}