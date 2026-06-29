using EluTech.API.DTOs.Notification;

namespace EluTech.API.Interfaces;

public interface INotificationService
{

    Task SendNotification(

    SendNotificationDto dto);



    Task<List<NotificationDto>>

    GetNotifications(

    int userId);



    Task MarkRead(

    int id);


    Task<List<int>> GetManagerUserIds();
}