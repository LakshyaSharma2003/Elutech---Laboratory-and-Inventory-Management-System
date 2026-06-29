using EluTech.API.Data;
using EluTech.API.DTOs.Audit;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class AuditService
: IAuditService
{

    private readonly ApplicationDbContext
    _context;



    public AuditService(

    ApplicationDbContext context)
    {

        _context = context;

    }



    public async Task Log(

    int? userId,

    string action,

    string entity,

    string oldValues,

    string newValues,

    string ip)
    {


        AuditLog log = new()
        {


            UserId = userId,


            Action = action,


            EntityName = entity,


            OldValues = oldValues,


            NewValues = newValues,


            IPAddress = ip,


            Timestamp = DateTime.UtcNow


        };



        _context.AuditLogs.Add(

        log);



        await _context.SaveChangesAsync();


    }








    public async Task<List<AuditDto>>

    GetLogs()
    {


        return await _context.AuditLogs



        .OrderByDescending(

        x => x.Timestamp)




        .Select(

        x => new AuditDto
        {


            Id = x.Id,



            UserId = x.UserId,



            Action = x.Action,



            EntityName = x.EntityName,



            IPAddress = x.IPAddress,



            Timestamp = x.Timestamp



        })



        .ToListAsync();



    }


}