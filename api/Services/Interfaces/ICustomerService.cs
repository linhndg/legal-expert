using LegalSaasApi.DTOs;

namespace LegalSaasApi.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<List<CustomerDto>> GetCustomersAsync(Guid userId);
        Task<CustomerWithMattersDto?> GetCustomerByIdAsync(Guid customerId, Guid userId);
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createDto, Guid userId);
        Task<CustomerDto?> UpdateCustomerAsync(Guid customerId, UpdateCustomerDto updateDto, Guid userId);
        Task<bool> DeleteCustomerAsync(Guid customerId, Guid userId);
    }
}
