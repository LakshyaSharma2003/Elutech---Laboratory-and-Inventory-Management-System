namespace EluTech.API.DTOs.Audit;

public class AuditDto
{

    public int Id { get; set; }



    public int? UserId { get; set; }



    public string? Action { get; set; }



    public string? EntityName { get; set; }



    public string? IPAddress { get; set; }



    public DateTime Timestamp { get; set; }

}