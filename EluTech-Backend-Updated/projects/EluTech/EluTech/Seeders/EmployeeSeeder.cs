using EluTech.API.Data;
using EluTech.API.Entities;

public static class EmployeeSeeder
{

    public static async Task Seed(
    ApplicationDbContext context)
    {


        if (context.Employees.Any())
            return;



        var employee =

        context.Users

        .First(

        x => x.Email == "employee@elutech.com");




        Employee emp = new()
        {

            UserId = employee.Id,


            Department = "Chemistry",


            Designation = "Lab Analyst",


            Salary = 50000,


            JoiningDate = DateTime.UtcNow


        };



        context.Employees.Add(emp);



        await context.SaveChangesAsync();



    }

}