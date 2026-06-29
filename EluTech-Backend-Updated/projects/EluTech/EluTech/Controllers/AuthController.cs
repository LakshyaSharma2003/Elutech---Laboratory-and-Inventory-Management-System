using Asp.Versioning;
using EluTech.API.DTOs.Auth;
using EluTech.API.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace EluTech.API.Controllers;


[ApiController]

[Route("api/[controller]")]
[ApiVersion("1.0")]
public class AuthController : ControllerBase
{


    private readonly IAuthService _service;



    public AuthController(
        IAuthService service)
    {

        _service = service;

    }



    [HttpPost("register")]

    public async Task<IActionResult>

        Register(RegisterDto dto)
    {


        await _service.Register(dto);


        return Ok(
            "User Created"
            );

    }




    [HttpPost("login")]

    public async Task<IActionResult>

        Login(LoginDto dto)
    {


        var response =
            await _service.Login(dto);


        return Ok(response);

    }

    [HttpPost("verify-otp")]

    public async Task<IActionResult>

VerifyOTP(
VerifyOtpDto dto)
    {


        await _service.VerifyOTP(

            dto.Email,

            dto.OTP

            );



        return Ok(

            "OTP Verified"

            );


    }

    [HttpPost("forgot-password")]

    public async Task<IActionResult>

ForgotPassword(

ForgotPasswordDto dto
)
    {


        await _service.ForgotPassword(

            dto.Email

        );



        return Ok(

            "OTP sent"

        );



    }


    [HttpPost("reset-password")]

    public async Task<IActionResult>

ResetPassword(

ResetPasswordDto dto

)
    {


        await _service.ResetPassword(

            dto.Email,

            dto.OTP,

            dto.NewPassword

        );




        return Ok(

            "Password Updated"

        );


    }


    [HttpPost("refresh-token")]

    public async Task<IActionResult>

Refresh(
RefreshTokenDto dto)
    {

        var result =

        await _service.RefreshToken(

        dto.RefreshToken);


        return Ok(result);

    }



    [HttpPost("revoke-token")]

    public async Task<IActionResult>

Revoke(
RefreshTokenDto dto)
    {

        await _service.RevokeToken(

        dto.RefreshToken);


        return Ok();


    }

    // DEV ONLY: Get latest OTP for an email (for testing when email is not configured)
    [HttpGet("dev-otp/{email}")]
    public async Task<IActionResult> GetDevOtp(string email)
    {
        var otp = await _service.GetLatestOtp(email);
        if (otp == null) return NotFound(new { message = "No OTP found for this email" });
        return Ok(new { otp = otp, message = "Remove this endpoint in production!" });
    }


    // Change password (authenticated)
    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out int userId))
            return BadRequest(new { message = "Invalid token" });

        await _service.ChangePassword(userId, dto.CurrentPassword, dto.NewPassword);
        return Ok(new { message = "Password changed successfully" });
    }

    // Update profile (authenticated)
    [Authorize]
    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out int userId))
            return BadRequest(new { message = "Invalid token" });

        await _service.UpdateProfile(userId, dto);
        return Ok(new { message = "Profile updated successfully" });
    }

}