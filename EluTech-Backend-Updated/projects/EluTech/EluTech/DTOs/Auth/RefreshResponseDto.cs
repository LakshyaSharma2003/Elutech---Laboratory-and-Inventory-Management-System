namespace EluTech.API.DTOs.Auth;

public class RefreshResponseDto
{
    public string? AccessToken { get; set; }

    public string? RefreshToken { get; set; }
}