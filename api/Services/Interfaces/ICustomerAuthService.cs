using LegalSaasApi.DTOs;
using LegalSaasApi.Models;

namespace LegalSaasApi.Services.Interfaces
{
    public interface ICustomerAuthService
    {
        Task<CustomerAuthResponseDto?> LoginAsync(CustomerLoginDto loginDto);
        Task<CustomerPortalDto?> GetCustomerProfileAsync(Guid customerId);
        Task<List<MatterDto>> GetCustomerMattersAsync(Guid customerId);
        string GenerateCustomerJwtToken(Customer customer);
        Task<List<object>> GetAllPortalCustomersAsync(); // Temporary debug method
    }
}
