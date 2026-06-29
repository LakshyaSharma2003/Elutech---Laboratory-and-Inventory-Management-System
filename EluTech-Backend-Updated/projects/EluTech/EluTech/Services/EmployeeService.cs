using BCrypt.Net;
using EluTech.API.Data;
using EluTech.API.DTOs.Employee;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class EmployeeService : IEmployeeService
{
    private readonly ApplicationDbContext _context;

    public EmployeeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddEmployee(AddEmployeeDto dto)
    {
        var role = await _context.Roles
            .FirstOrDefaultAsync(x => x.Name == dto.RoleName);

        if (role == null)
            throw new Exception("Role not found");


        User user = new()
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),

            RoleId = role.Id,
            IsActive = true
        };


        _context.Users.Add(user);

        await _context.SaveChangesAsync();


        Employee employee = new()
        {
            UserId = user.Id,

            Department = dto.Department,

            Designation = dto.Designation,

            Salary = dto.Salary,

            JoiningDate = DateTime.UtcNow,

            IsTerminated = false
        };


        _context.Employees.Add(employee);

        await _context.SaveChangesAsync();
    }


    public async Task<List<EmployeeDto>> GetEmployees()
    {
        return await _context.Employees

            .Include(x => x.User)

            .Select(x => new EmployeeDto
            {
                Id = x.Id,

                Name = x.User.FullName,

                Email = x.User.Email,

                Department = x.Department,

                Designation = x.Designation,

                Salary = x.Salary,

                IsTerminated = x.IsTerminated
            })

            .ToListAsync();
    }



    public async Task FireEmployee(int id)
    {

        var employee = await _context.Employees

            .Include(x => x.User)

            .FirstOrDefaultAsync(

                x => x.Id == id
            );


        if (employee == null)
            throw new Exception("Employee not found");


        employee.IsTerminated = true;

        employee.TerminatedDate = DateTime.UtcNow;


        employee.User.IsActive = false;


        await _context.SaveChangesAsync();
    }



    public async Task<object?> GetEmployeeIdByUserId(int userId)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (employee == null) return null;

        return new { employeeId = employee.Id, userId = userId };
    }

}