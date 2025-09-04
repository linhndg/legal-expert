using LegalSaasApi.Models;

namespace LegalSaasApi.Repositories.Interfaces
{
    public interface IMatterRepository
    {
        Task<List<Matter>> GetByCustomerIdAsync(Guid customerId, Guid userId);
        Task<Matter?> GetByIdAsync(Guid id, Guid customerId, Guid userId);
        Task<Matter> CreateAsync(Matter matter);
        Task<Matter> UpdateAsync(Matter matter);
        Task<bool> DeleteAsync(Guid id, Guid customerId, Guid userId);
        Task<bool> ExistsAsync(Guid id, Guid customerId, Guid userId);
    }
}