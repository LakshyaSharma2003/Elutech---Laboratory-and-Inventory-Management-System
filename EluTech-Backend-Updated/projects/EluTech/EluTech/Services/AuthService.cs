using BCrypt.Net;

using EluTech.API.Data;
using EluTech.API.DTOs.Auth;
using EluTech.API.Entities;
using EluTech.API.Helpers;
using EluTech.API.Interfaces;

using Microsoft.EntityFrameworkCore;



namespace EluTech.API.Services;


public class AuthService : IAuthService
{


    private readonly ApplicationDbContext _context;


    private readonly IJwtService _jwt;

    private readonly IEmailService _email;


    private readonly ISmsService _sms;




    public AuthService(

ApplicationDbContext context,

IJwtService jwt,

IEmailService email,

ISmsService sms

)
    {

        _context = context;

        _jwt = jwt;

        _email = email;

        _sms = sms;

    }



    public async Task Register(RegisterDto dto)
    {


        bool exists =
            await _context.Users
            .AnyAsync(x => x.Email == dto.Email);



        if (exists)
            throw new Exception("User already exists");




        var role =
            await _context.Roles
            .FirstOrDefaultAsync(
                x => x.Name == dto.RoleName
            );




        if (role == null)
            throw new Exception("Role not found");




        User user = new()
        {

            FullName = dto.FullName,

            Email = dto.Email,

            PhoneNumber = dto.PhoneNumber,



            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                dto.Password
                ),

            RoleId = role.Id,


            IsActive = true

        };



        _context.Users.Add(user);

        await _context.SaveChangesAsync();



    }





    public async Task<LoginResponseDto>

        Login(LoginDto dto)
    {



        var user =
            await _context.Users


            .Include(x => x.Role)


            .FirstOrDefaultAsync(

                x => x.Email == dto.Email
            );



        if (user == null)
            throw new Exception("Invalid Email");




        bool valid =
            BCrypt.Net.BCrypt.Verify(

                dto.Password,

                user.PasswordHash

                );



        if (!valid)
            throw new Exception("Wrong Password");



        string token =
            _jwt.GenerateToken(user);

        string refresh = _jwt.GenerateRefreshToken();

        RefreshToken refreshToken = new()
        {
            Token = refresh,

            UserId = user.Id,

            ExpiryDate = DateTime.UtcNow.AddDays(7),

            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);

        await _context.SaveChangesAsync();



        return new LoginResponseDto
        {

            Token = token,


            Expiration =
            DateTime.UtcNow.AddHours(1),


            Role = user.Role.Name


        };



    }
    public async Task SendOTP(
 string email)
    {


        var user =

        await _context.Users


        .FirstOrDefaultAsync(

        x => x.Email == email);



        if (user == null)
            throw new Exception(

            "User not found"

            );



        string otp =

        OtpGenerator.Generate();




        OTP code = new()
        {


            UserId = user.Id,


            Code = otp,


            ExpiryTime =

        DateTime.UtcNow.AddMinutes(5),



            IsUsed = false


        };




        _context.OTPs.Add(code);



        await _context.SaveChangesAsync();




        await _email.SendEmail(

        email,


        "OTP Verification",


        $"Your OTP is {otp}"


        );




        await _sms.SendSms(

        user.PhoneNumber,


        $"OTP : {otp}"

        );



    }


    public async Task VerifyOTP(
    string email,
    string otp)
    {

        // Find user
        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Email == email
            );


        if (user == null)
            throw new Exception("User not found");



        // Find OTP
        var code = await _context.OTPs
            .FirstOrDefaultAsync(

                x =>

                x.UserId == user.Id &&

                x.Code == otp &&

                x.IsUsed == false

            );



        if (code == null)
            throw new Exception("Invalid OTP");




        // Check expiration

        if (code.ExpiryTime < DateTime.UtcNow)
            throw new Exception("OTP Expired");




        // Mark OTP used

        code.IsUsed = true;



        await _context.SaveChangesAsync();


    }



    public async Task ForgotPassword(
    string email)
    {


        var user = await _context.Users
            .FirstOrDefaultAsync(

                x => x.Email == email

            );



        if (user == null)
            throw new Exception(
                "User not found"
            );



        // Reuse SendOTP()

        await SendOTP(email);


    }



    public async Task ResetPassword(
      string email,
      string otp,
      string password)
    {


        var user = await _context.Users
            .FirstOrDefaultAsync(

                x => x.Email == email

            );



        if (user == null)
            throw new Exception(

                "User not found"

            );




        var code = await _context.OTPs


            .FirstOrDefaultAsync(


                x =>

                x.UserId == user.Id &&

                x.Code == otp &&

                x.IsUsed == false


            );




        if (code == null)

            throw new Exception(

                "Invalid OTP"

            );




        if (code.ExpiryTime < DateTime.UtcNow)

            throw new Exception(

                "OTP Expired"

            );




        code.IsUsed = true;




        user.PasswordHash =

            BCrypt.Net.BCrypt.HashPassword(

                password

            );




        await _context.SaveChangesAsync();


    }


    public async Task<RefreshResponseDto> RefreshToken(string token)
    {
        var refresh = await _context.RefreshTokens

            .Include(x => x.User)

            .ThenInclude(x => x.Role)

            .FirstOrDefaultAsync(

                x => x.Token == token

            );


        if (refresh == null)
            throw new Exception("Token not found");


        if (refresh.IsRevoked)
            throw new Exception("Revoked");


        if (refresh.ExpiryDate < DateTime.UtcNow)
            throw new Exception("Expired");



        string access =

            _jwt.GenerateToken(

                refresh.User

            );



        string newRefresh =

            _jwt.GenerateRefreshToken();



        refresh.Token = newRefresh;



        await _context.SaveChangesAsync();



        return new RefreshResponseDto
        {
            AccessToken = access,

            RefreshToken = newRefresh
        };
    }



    public async Task RevokeToken(
    string token)
    {

        var refresh =

            await _context.RefreshTokens

            .FirstOrDefaultAsync(

                x => x.Token == token

            );


        if (refresh == null)
            return;



        refresh.IsRevoked = true;

        refresh.RevokedAt = DateTime.UtcNow;



        await _context.SaveChangesAsync();

    }

    public async Task<string?> GetLatestOtp(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user == null) return null;

        var otp = await _context.OTPs
            .Where(x => x.UserId == user.Id && !x.IsUsed && x.ExpiryTime > DateTime.UtcNow)
            .OrderByDescending(x => x.Id)
            .Select(x => x.Code)
            .FirstOrDefaultAsync();

        return otp;
    }


    public async Task ChangePassword(int userId, string currentPassword, string newPassword)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            throw new Exception("Current password is incorrect");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateProfile(int userId, EluTech.API.DTOs.Auth.UpdateProfileDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        if (!string.IsNullOrWhiteSpace(dto.FullName))   user.FullName = dto.FullName;
        if (!string.IsNullOrWhiteSpace(dto.PhoneNumber)) user.PhoneNumber = dto.PhoneNumber;
        if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
        {
            bool taken = await _context.Users.AnyAsync(x => x.Email == dto.Email && x.Id != userId);
            if (taken) throw new Exception("Email already in use");
            user.Email = dto.Email;
        }
        await _context.SaveChangesAsync();
    }

}