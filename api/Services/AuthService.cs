using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LegalSaasApi.Models;
using LegalSaasApi.DTOs;
using LegalSaasApi.Repositories.Interfaces;
using LegalSaasApi.Services.Interfaces;

namespace LegalSaasApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> SignupAsync(SignupRequestDto signupDto)
        {
            // Check if user already exists
            var emailExists = await _userRepository.EmailExistsAsync(signupDto.Email);

            if (emailExists)
            {
                return null; // User already exists
            }

            // Create new user
            var user = new User
            {
                Email = signupDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(signupDto.Password),
                FirstName = signupDto.FirstName,
                LastName = signupDto.LastName,
                FirmName = signupDto.FirmName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            var token = GenerateJwtToken(user);
            var userDto = MapToUserDto(user);

            return new AuthResponseDto
            {
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponseDto?> SignupAsync(SignupDto signupDto)
        {
            // Check if user already exists
            var emailExists = await _userRepository.EmailExistsAsync(signupDto.Email);

            if (emailExists)
            {
                return null; // User already exists
            }

            // Split name into first and last name (simple approach)
            var nameParts = signupDto.Name.Trim().Split(' ', 2);
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? nameParts[1] : "";

            // Create new user
            var user = new User
            {
                Email = signupDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(signupDto.Password),
                FirstName = firstName,
                LastName = lastName,
                FirmName = "", // Default empty for SignupDto
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            var token = GenerateJwtToken(user);
            var userDto = MapToUserDto(user);

            return new AuthResponseDto
            {
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null; // Invalid credentials
            }

            var token = GenerateJwtToken(user);
            var userDto = MapToUserDto(user);

            return new AuthResponseDto
            {
                Token = token,
                User = userDto
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user != null ? MapToUserDto(user) : null;
        }

        public string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "your-super-secret-jwt-key-that-is-at-least-32-characters-long";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "LegalSaasApi";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "LegalSaasClient";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim("firm_name", user.FirmName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FirmName = user.FirmName,
                CreatedAt = user.CreatedAt
            };
        }
    }
}