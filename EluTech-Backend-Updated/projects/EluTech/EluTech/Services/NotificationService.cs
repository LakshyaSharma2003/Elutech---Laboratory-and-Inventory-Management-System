using EluTech.API.Data;
using EluTech.API.DTOs.Notification;
using EluTech.API.Entities;
using EluTech.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EluTech.API.Services;

public class NotificationService
: INotificationService
{

    private readonly ApplicationDbContext
    _context;



    public NotificationService(

    ApplicationDbContext context)
    {

        _context = context;

    }




    public async Task SendNotification(

    SendNotificationDto dto)
    {


        Notification notification = new()
        {


            UserId = dto.UserId,


            Title = dto.Title,


            Message = dto.Message,


            Type = dto.Type,


            IsRead = false,


            SentAt = DateTime.UtcNow


        };



        _context.Notifications.Add(

        notification);



        await _context.SaveChangesAsync();


    }







    public async Task<List<NotificationDto>>

    GetNotifications(

    int userId)
    {


        return await _context.Notifications


        .Where(

        x => x.UserId == userId)



        .OrderByDescending(

        x => x.SentAt)



        .Select(

        x => new NotificationDto
        {


            Id = x.Id,



            Title = x.Title,



            Message = x.Message,



            Type = x.Type,



            IsRead = x.IsRead,



            SentAt = x.SentAt



        })



        .ToListAsync();



    }






    public async Task MarkRead(

    int id)
    {


        var notification =


        await _context.Notifications


        .FirstOrDefaultAsync(

        x => x.Id == id);



        if (notification == null)

            throw new Exception();



        notification.IsRead = true;



        await _context.SaveChangesAsync();



    }




    public async Task<List<int>> GetManagerUserIds()
    {
        return await _context.Users
            .Include(x => x.Role)
            .Where(x => x.Role.Name == "Manager")
            .Select(x => x.Id)
            .ToListAsync();
    }

}