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
    public class CustomerAuthService : ICustomerAuthService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMatterRepository _matterRepository;
        private readonly IConfiguration _configuration;

        public CustomerAuthService(
            ICustomerRepository customerRepository, 
            IMatterRepository matterRepository,
            IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _matterRepository = matterRepository;
            _configuration = configuration;
        }

        public async Task<CustomerAuthResponseDto?> LoginAsync(CustomerLoginDto loginDto)
        {
            // Find customer by email
            var customer = await _customerRepository.GetByEmailAsync(loginDto.Email);

            if (customer == null || string.IsNullOrEmpty(customer.PasswordHash))
            {
                return null; // Customer not found or no password set
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.PasswordHash))
            {
                return null; // Invalid password
            }

            // Update last login
            customer.LastLogin = DateTime.UtcNow;
            await _customerRepository.UpdateAsync(customer);

            var token = GenerateCustomerJwtToken(customer);
            var customerDto = MapToCustomerPortalDto(customer);

            return new CustomerAuthResponseDto
            {
                Token = token,
                Customer = customerDto
            };
        }

        public async Task<CustomerPortalDto?> GetCustomerProfileAsync(Guid customerId)
        {
            var customer = await _customerRepository.GetByIdForPortalAsync(customerId);
            
            if (customer == null)
                return null;

            return MapToCustomerPortalDto(customer);
        }

        public async Task<List<MatterDto>> GetCustomerMattersAsync(Guid customerId)
        {
            var customer = await _customerRepository.GetByIdForPortalAsync(customerId);
            
            if (customer == null)
                return new List<MatterDto>();

            return customer.Matters.Select(MapToMatterDto).OrderByDescending(m => m.CreatedAt).ToList();
        }

        public string GenerateCustomerJwtToken(Customer customer)
        {
            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
            {
                throw new InvalidOperationException("JWT configuration is missing");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                new Claim(ClaimTypes.Email, customer.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, customer.Name),
                new Claim("customer_id", customer.Id.ToString()),
                new Claim("user_type", "customer")
            };

            var keyBytes = Encoding.UTF8.GetBytes(key);
            var signingKey = new SymmetricSecurityKey(keyBytes);
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Customer tokens valid for 7 days
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static CustomerPortalDto MapToCustomerPortalDto(Customer customer)
        {
            return new CustomerPortalDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email ?? string.Empty,
                PhoneNumber = customer.PhoneNumber,
                Address = customer.Address,
                LastLogin = customer.LastLogin,
                CreatedAt = customer.CreatedAt
            };
        }

        private static MatterDto MapToMatterDto(Matter matter)
        {
            return new MatterDto
            {
                Id = matter.Id,
                CustomerId = matter.CustomerId,
                Name = matter.Name,
                Description = matter.Description,
                Status = matter.Status,
                CreatedAt = matter.CreatedAt,
                UpdatedAt = matter.UpdatedAt
            };
        }

        // Temporary debug method
        public async Task<List<object>> GetAllPortalCustomersAsync()
        {
            var customers = await _customerRepository.GetAllPortalCustomersAsync();
            return customers.Select(c => new {
                c.Id,
                c.Name,
                c.Email,
                c.IsPortalEnabled,
                HasPassword = !string.IsNullOrEmpty(c.PasswordHash)
            }).Cast<object>().ToList();
        }
    }
}
