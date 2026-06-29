using Asp.Versioning;
using EluTech.API.DTOs.Notification;
using EluTech.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EluTech.API.Controllers;


[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
public class NotificationController
: ControllerBase
{


    private readonly INotificationService
    _service;



    public NotificationController(

    INotificationService service)
    {

        _service = service;

    }




    [HttpPost]


    public async Task<IActionResult>

    Send(

    SendNotificationDto dto)
    {

        await _service.SendNotification(

        dto);


        return Ok();

    }




    [HttpGet(

    "{userId}")]


    public async Task<IActionResult>

    Notifications(

    int userId)
    {

        return Ok(

        await _service.GetNotifications(

        userId));

    }




    [HttpPut(

    "read/{id}")]


    public async Task<IActionResult>

    Read(

    int id)
    {


        await _service.MarkRead(

        id);



        return Ok();


    }




    // Get all manager user IDs (so employees/finance can notify managers)
    [Authorize]
    [HttpGet("manager-ids")]
    public async Task<IActionResult> GetManagerIds()
    {
        var managerIds = await _service.GetManagerUserIds();
        return Ok(managerIds);
    }

}