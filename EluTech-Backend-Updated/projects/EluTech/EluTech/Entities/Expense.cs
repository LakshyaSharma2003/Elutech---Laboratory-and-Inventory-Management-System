using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Expense : BaseEntity
{


    public string? Title { get; set; }



    public decimal Amount { get; set; }



    public DateTime ExpenseDate { get; set; }



    public string? Category { get; set; }



    public string? Description { get; set; }


}