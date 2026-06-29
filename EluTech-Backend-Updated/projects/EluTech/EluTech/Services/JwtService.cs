using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using EluTech.API.Entities;
using EluTech.API.Interfaces;

using Microsoft.IdentityModel.Tokens;



namespace EluTech.API.Services;

public class JwtService : IJwtService
{

    private readonly IConfiguration _config;


    public JwtService(
        IConfiguration config)
    {
        _config = config;
    }



    public string GenerateToken(User user)
    {


        var claims = new List<Claim>
        {


            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Name,
                user.FullName
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role.Name
            )

        };



        var key =
            new SymmetricSecurityKey(

            Encoding.UTF8.GetBytes(
                _config["Jwt:Key"]!
                ));


        var credentials =
            new SigningCredentials(

                key,

                SecurityAlgorithms.HmacSha256);



        var token =
            new JwtSecurityToken(

                issuer:
                _config["Jwt:Issuer"],


                audience:
                _config["Jwt:Audience"],


                claims:
                claims,


                expires:
                DateTime.UtcNow.AddHours(1),


                signingCredentials:
                credentials

            );



        return new JwtSecurityTokenHandler()
            .WriteToken(token);

    }

    public string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString() + Guid.NewGuid().ToString();
    }
}