using EluTech.API.Data;
using EluTech.API.Entities;


namespace EluTech.API.Seeders;



public class RoleSeeder
{

    public static async Task SeedRoles(

    ApplicationDbContext context)
    {


        if (context.Roles.Any())
            return;



        var roles = new List<Role>
{


new()
{
Name="Manager"
},

new()
{
Name="FinanceOfficer"
},

new()
{
Name="Employee"
}


};



        context.Roles.AddRange(roles);


        await context.SaveChangesAsync();


    }



}