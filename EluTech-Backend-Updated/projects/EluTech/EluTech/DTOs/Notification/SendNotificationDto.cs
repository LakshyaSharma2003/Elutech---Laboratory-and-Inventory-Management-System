namespace EluTech.API.DTOs.Notification;

public class SendNotificationDto
{

    public int UserId { get; set; }


    public string? Title { get; set; }


    public string? Message { get; set; }


    public string? Type { get; set; }

}