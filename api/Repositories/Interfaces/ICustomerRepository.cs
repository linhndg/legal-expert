using LegalSaasApi.Models;

namespace LegalSaasApi.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        Task<List<Customer>> GetByUserIdAsync(Guid userId);
        Task<Customer?> GetByIdAsync(Guid id, Guid userId);
        Task<Customer?> GetByIdWithMattersAsync(Guid id, Guid userId);
        Task<Customer> CreateAsync(Customer customer);
        Task<Customer> UpdateAsync(Customer customer);
        Task<bool> DeleteAsync(Guid id, Guid userId);
        Task<bool> ExistsAsync(Guid id, Guid userId);
    }
}