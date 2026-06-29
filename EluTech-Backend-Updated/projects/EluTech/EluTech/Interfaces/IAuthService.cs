using EluTech.API.DTOs.Auth;

namespace EluTech.API.Interfaces;

public interface IAuthService
{

    // Existing methods
    Task Register(RegisterDto dto);

    Task<LoginResponseDto> Login(LoginDto dto);



    // New OTP Methods
    Task SendOTP(string email);


    Task VerifyOTP(
        string email,
        string otp);



    // Password recovery
    Task ForgotPassword(
        string email);



    Task ResetPassword(
        string email,
        string otp,
        string password);

    Task<RefreshResponseDto> RefreshToken(string token);

    Task RevokeToken(string token);


    Task<string?> GetLatestOtp(string email);

    Task ChangePassword(int userId, string currentPassword, string newPassword);
    Task UpdateProfile(int userId, EluTech.API.DTOs.Auth.UpdateProfileDto dto);
}