using EluTech.API.Common;

namespace EluTech.API.Entities;

public class RefreshToken : BaseEntity
{
    public string? Token { get; set; }

    public DateTime ExpiryDate { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime? RevokedAt { get; set; }

    public int UserId { get; set; }

    public User User { get; set; }
}