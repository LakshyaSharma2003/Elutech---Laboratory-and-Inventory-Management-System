using EluTech.API.Data;
using EluTech.API.DTOs.Finance;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace EluTech.API.Services;

public class FinanceService : IFinanceService
{
    private readonly ApplicationDbContext _context;

    public FinanceService(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task AddPayment(AddPaymentDto dto)
    {
        Payment payment = new()
        {
            CustomerId = dto.CustomerId,
            Amount = dto.Amount,
            PaymentMethod = dto.PaymentMethod,
            ReferenceNumber = dto.ReferenceNumber,
            Status = "Paid",
            PaymentDate = DateTime.UtcNow
        };

        _context.Payments.Add(payment);

        await _context.SaveChangesAsync();
    }



    public async Task AddExpense(AddExpenseDto dto)
    {
        Expense expense = new()
        {
            Title = dto.Title,
            Amount = dto.Amount,
            Category = dto.Category,
            Description = dto.Description,
            ExpenseDate = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);

        await _context.SaveChangesAsync();
    }



    public async Task PaySalary(PaySalaryDto dto)
    {
        Salary salary = new()
        {
            EmployeeId = dto.EmployeeId,
            Amount = dto.Amount,
            Month = dto.Month,
            PaidDate = DateTime.UtcNow,
            IsPaid = true
        };

        _context.Salaries.Add(salary);

        await _context.SaveChangesAsync();
    }



    public async Task AddTax(TaxDto dto)
    {
        Tax tax = new()
        {
            TaxName = dto.TaxName,
            Amount = dto.Amount,
            TaxDate = DateTime.UtcNow
        };

        _context.Taxes.Add(tax);

        await _context.SaveChangesAsync();
    }




    public async Task<ProfitLossDto> GetProfitLoss()
    {
        ProfitLossDto dto = new();

        dto.Revenue =
            await _context.Payments.SumAsync(x => x.Amount);

        dto.Expenses =
            await _context.Expenses.SumAsync(x => x.Amount);

        dto.Salaries =
            await _context.Salaries.SumAsync(x => x.Amount);

        dto.Taxes =
            await _context.Taxes.SumAsync(x => x.Amount);


        dto.Profit =
            dto.Revenue
            - dto.Expenses
            - dto.Salaries
            - dto.Taxes;


        return dto;
    }





    public async Task GenerateInvoice(
        GenerateInvoiceDto dto)
    {

        decimal gstAmount =
            (dto.Amount * dto.GSTPercentage) / 100;



        Invoice invoice = new()
        {
            InvoiceNumber =
                $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}",

            CustomerId = dto.CustomerId,

            SubTotal = dto.Amount,

            GST = gstAmount,

            TotalAmount =
                dto.Amount + gstAmount,

            InvoiceDate = DateTime.UtcNow,

            DueDate =
                DateTime.UtcNow.AddDays(30),

            Notes = dto.Notes
        };


        _context.Invoices.Add(invoice);

        await _context.SaveChangesAsync();
    }





    public async Task<List<InvoiceDto>>
        GetInvoices()
    {

        return await _context.Invoices

            .Include(x => x.Customer)

            .Select(x => new InvoiceDto
            {
                Id = x.Id,

                InvoiceNumber =
                    x.InvoiceNumber,

                Customer =
                    x.Customer.Name,

                TotalAmount =
                    x.TotalAmount,

                InvoiceDate =
                    x.InvoiceDate,

                IsPaid =
                    x.IsPaid
            })

            .ToListAsync();

    }





    public async Task<byte[]> DownloadInvoice(
        int invoiceId)
    {

        var invoice =
            await _context.Invoices

            .Include(x => x.Customer)

            .FirstOrDefaultAsync(
                x => x.Id == invoiceId);


        if (invoice == null)
            throw new Exception(
                "Invoice not found");


        byte[] pdf = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Content().Column(column =>
                {

                    column.Item().Text("ELUTECH");


                    column.Item().Text(
                        invoice.InvoiceNumber);


                    column.Item().Text(
                        invoice.Customer.Name);


                    column.Item().Text(
                        $"Subtotal : {invoice.SubTotal}");


                    column.Item().Text(
                        $"GST : {invoice.GST}");


                    column.Item().Text(
                        $"Total : {invoice.TotalAmount}");

                });
            });

        }).GeneratePdf();



        return pdf;

    }

}