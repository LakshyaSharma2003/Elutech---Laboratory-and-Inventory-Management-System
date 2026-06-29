using EluTech.API.Common;

namespace EluTech.API.Entities;

public class OTP : BaseEntity
{

    public int UserId { get; set; }

    public User User { get; set; }



    public string? Code { get; set; }



    public DateTime ExpiryTime { get; set; }



    public bool IsUsed { get; set; }


}