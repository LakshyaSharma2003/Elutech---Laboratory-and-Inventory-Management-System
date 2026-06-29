using EluTech.API.Common;

namespace EluTech.API.Entities;

public class AuditLog : BaseEntity
{
    public int? UserId { get; set; }

    public User User { get; set; }


    public string? Action { get; set; }


    public string? EntityName { get; set; }


    public string? OldValues { get; set; }


    public string? NewValues { get; set; }


    public string? IPAddress { get; set; }


    public DateTime Timestamp { get; set; }


}