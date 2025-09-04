using LegalSaasApi.DTOs;

namespace LegalSaasApi.Services.Interfaces
{
    public interface IMatterService
    {
        Task<List<MatterDto>> GetMattersAsync(Guid customerId, Guid userId);
        Task<MatterDto?> GetMatterByIdAsync(Guid customerId, Guid matterId, Guid userId);
        Task<MatterDto?> CreateMatterAsync(Guid customerId, CreateMatterDto createDto, Guid userId);
        Task<MatterDto?> UpdateMatterAsync(Guid customerId, Guid matterId, UpdateMatterDto updateDto, Guid userId);
        Task<bool> DeleteMatterAsync(Guid customerId, Guid matterId, Guid userId);
    }
}
