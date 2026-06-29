using EluTech.API.DTOs.Finance;

namespace EluTech.API.Interfaces;

public interface IFinanceService
{

    Task AddPayment(AddPaymentDto dto);

    Task AddExpense(AddExpenseDto dto);

    Task PaySalary(PaySalaryDto dto);

    Task AddTax(TaxDto dto);

    Task<ProfitLossDto> GetProfitLoss();

    Task GenerateInvoice(
GenerateInvoiceDto dto);



    Task<List<InvoiceDto>>
    GetInvoices();



    Task<byte[]>
    DownloadInvoice(
    int invoiceId);

}