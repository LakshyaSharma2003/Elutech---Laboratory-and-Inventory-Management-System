using EluTech.API.DTOs.Audit;

namespace EluTech.API.Interfaces;



public interface IAuditService
{

    Task Log(

    int? userId,

    string action,

    string entity,

    string oldValues,

    string newValues,

    string ip);



    Task<List<AuditDto>>

    GetLogs();

}