using EluTech.API.Common;

namespace EluTech.API.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }

    public User User { get; set; }


    public string? Title { get; set; }


    public string? Message { get; set; }


    public bool IsRead { get; set; }


    public string? Type { get; set; }


    public DateTime SentAt { get; set; }

}