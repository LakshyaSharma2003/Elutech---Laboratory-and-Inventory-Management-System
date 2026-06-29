using EluTech.API.DTOs.Employee;

namespace EluTech.API.Interfaces;



public interface IEmployeeService
{


    Task AddEmployee(

    AddEmployeeDto dto);



    Task<List<EmployeeDto>>

    GetEmployees();




    Task FireEmployee(

    int id);




    Task<object?> GetEmployeeIdByUserId(int userId);
}