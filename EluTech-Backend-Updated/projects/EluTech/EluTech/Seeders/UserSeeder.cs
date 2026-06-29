using EluTech.API.Data;
using EluTech.API.Entities;

namespace EluTech.API.Seeders;

public static class UserSeeder
{
    public static async Task Seed(ApplicationDbContext context)
    {
        if (context.Users.Any())
            return;


        var managerRole =
            context.Roles.First(x => x.Name == "Manager");

        var financeRole =
            context.Roles.First(x => x.Name == "FinanceOfficer");

        var employeeRole =
            context.Roles.First(x => x.Name == "Employee");



        List<User> users = new()
        {

            new User
            {
                FullName="Lakshya Manager",

                Email="manager@elutech.com",

                PhoneNumber="9999999999",

                PasswordHash=
                BCrypt.Net.BCrypt.HashPassword("123456"),


                RoleId=managerRole.Id,

                IsActive=true
            },



            new User
            {

                FullName="Finance Officer",

                Email="finance@elutech.com",

                PhoneNumber="8888888888",

                PasswordHash=
                BCrypt.Net.BCrypt.HashPassword("123456"),


                RoleId=financeRole.Id,

                IsActive=true

            },



            new User
            {
                FullName="Employee One",

                Email="employee@elutech.com",

                PhoneNumber="7777777777",

                PasswordHash=
                BCrypt.Net.BCrypt.HashPassword("123456"),

                RoleId=employeeRole.Id,

                IsActive=true
            }

        };


        context.Users.AddRange(users);

        await context.SaveChangesAsync();

    }
}