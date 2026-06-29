using EluTech.API.Entities;

namespace EluTech.API.Interfaces;


public interface IJwtService
{

    string GenerateToken(User user);
    string GenerateRefreshToken();

}