using EluTech.API.Data;
using EluTech.API.DTOs.Dashboard;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class DashboardService
    : IDashboardService
{

    private readonly ApplicationDbContext _context;


    public DashboardService(
        ApplicationDbContext context)
    {

        _context = context;

    }



    public async Task<DashboardDto>

        ManagerDashboard()
    {

        DashboardDto dto = new();




        dto.Employees =

            await _context.Employees

            .CountAsync();





        dto.PresentEmployees =


            await _context.Attendances


            .CountAsync(

            x => x.Date.Date

            == DateTime.UtcNow.Date);



        dto.ActiveSamples =


            await _context.Samples


            .CountAsync(

            x => x.Status == "Active");





        dto.PendingRequests =


            await _context.TestingRequests


            .CountAsync(

            x => x.Status == "Pending");




        dto.PendingReports =


            await _context.Reports


            .CountAsync(

            x => x.Status == "Pending");





        dto.LowStockChemicals =


            await _context.Chemicals


            .CountAsync(

            x => x.Quantity

            <= x.MinimumStock);




        return dto;

    }






    public async Task<FinanceDashboardDto>

        FinanceDashboard()
    {


        FinanceDashboardDto dto = new();




        dto.Revenue =


            await _context.Payments

            .SumAsync(

            x => x.Amount);




        dto.Expenses =


            await _context.Expenses

            .SumAsync(

            x => x.Amount);




        dto.Salaries =


            await _context.Salaries

            .SumAsync(

            x => x.Amount);




        dto.Taxes =


            await _context.Taxes

            .SumAsync(

            x => x.Amount);




        dto.Profit =


            dto.Revenue


            - dto.Expenses


            - dto.Salaries


            - dto.Taxes;




        return dto;


    }






    public async Task<EmployeeDashboardDto>

        EmployeeDashboard(

        int employeeId)
    {

        EmployeeDashboardDto dto = new();




        dto.AssignedSamples =


            await _context.Samples


            .CountAsync(

            x => x.AssignedEmployeeId

            == employeeId);





        dto.PendingRequests =


            await _context.TestingRequests


            .CountAsync(

            x => x.EmployeeId

            == employeeId


            &&


            x.Status == "Pending");





        dto.ReportsUploaded =


            await _context.Reports


            .CountAsync(

            x => x.EmployeeId

            == employeeId);





        return dto;

    }

}