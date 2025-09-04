using LegalSaasApi.DTOs;
using LegalSaasApi.Models;

namespace LegalSaasApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> SignupAsync(SignupRequestDto signupDto);
        Task<AuthResponseDto?> SignupAsync(SignupDto signupDto);
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto);
        Task<UserDto?> GetUserByIdAsync(Guid userId);
        string GenerateJwtToken(User user);
    }
}
