using EluTech.API.Common;

namespace EluTech.API.Entities;

public class User : BaseEntity
{
    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? PasswordHash { get; set; }

    public bool IsActive { get; set; } = true;


    public int RoleId { get; set; }

    public Role Role { get; set; }



    public ICollection<RefreshToken> RefreshTokens
    { get; set; }
    = new List<RefreshToken>();

}