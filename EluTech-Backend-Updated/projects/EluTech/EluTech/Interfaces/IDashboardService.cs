using EluTech.API.DTOs.Dashboard;

namespace EluTech.API.Interfaces;



public interface IDashboardService
{


    Task<DashboardDto>

    ManagerDashboard();



    Task<FinanceDashboardDto>

    FinanceDashboard();



    Task<EmployeeDashboardDto>

    EmployeeDashboard(

    int employeeId);



}