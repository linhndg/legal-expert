using LegalSaasApi.Models;
using LegalSaasApi.DTOs;
using LegalSaasApi.Repositories.Interfaces;
using LegalSaasApi.Services.Interfaces;

namespace LegalSaasApi.Services
{
    public class MatterService : IMatterService
    {
        private readonly IMatterRepository _matterRepository;
        private readonly ICustomerRepository _customerRepository;

        public MatterService(IMatterRepository matterRepository, ICustomerRepository customerRepository)
        {
            _matterRepository = matterRepository;
            _customerRepository = customerRepository;
        }

        public async Task<List<MatterDto>> GetMattersAsync(Guid customerId, Guid userId)
        {
            // First verify the customer belongs to the user
            var customerExists = await _customerRepository.ExistsAsync(customerId, userId);

            if (!customerExists)
                return new List<MatterDto>();

            var matters = await _matterRepository.GetByCustomerIdAsync(customerId, userId);
            return matters.Select(MapToMatterDto).ToList();
        }

        public async Task<MatterDto?> GetMatterByIdAsync(Guid customerId, Guid matterId, Guid userId)
        {
            // First verify the customer belongs to the user
            var customerExists = await _customerRepository.ExistsAsync(customerId, userId);

            if (!customerExists)
                return null;

            var matter = await _matterRepository.GetByIdAsync(matterId, customerId, userId);

            if (matter == null)
                return null;

            return MapToMatterDto(matter);
        }

        public async Task<MatterDto?> CreateMatterAsync(Guid customerId, CreateMatterDto createDto, Guid userId)
        {
            // First verify the customer belongs to the user
            var customerExists = await _customerRepository.ExistsAsync(customerId, userId);

            if (!customerExists)
                return null;

            var matter = new Matter
            {
                CustomerId = customerId,
                Name = createDto.Name,
                Description = createDto.Description,
                CaseType = createDto.CaseType,
                Status = createDto.Status,
                StartDate = createDto.StartDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdMatter = await _matterRepository.CreateAsync(matter);
            return MapToMatterDto(createdMatter);
        }

        public async Task<MatterDto?> UpdateMatterAsync(Guid customerId, Guid matterId, UpdateMatterDto updateDto, Guid userId)
        {
            // First verify the customer belongs to the user
            var customerExists = await _customerRepository.ExistsAsync(customerId, userId);

            if (!customerExists)
                return null;

            var matter = await _matterRepository.GetByIdAsync(matterId, customerId, userId);

            if (matter == null)
                return null;

            matter.Name = updateDto.Name;
            matter.Description = updateDto.Description;
            matter.CaseType = updateDto.CaseType;
            matter.Status = updateDto.Status;
            matter.StartDate = updateDto.StartDate;
            matter.UpdatedAt = DateTime.UtcNow;

            var updatedMatter = await _matterRepository.UpdateAsync(matter);
            return MapToMatterDto(updatedMatter);
        }

        public async Task<bool> DeleteMatterAsync(Guid customerId, Guid matterId, Guid userId)
        {
            // First verify the customer belongs to the user
            var customerExists = await _customerRepository.ExistsAsync(customerId, userId);

            if (!customerExists)
                return false;

            return await _matterRepository.DeleteAsync(matterId, customerId, userId);
        }

        private static MatterDto MapToMatterDto(Matter matter)
        {
            return new MatterDto
            {
                Id = matter.Id,
                CustomerId = matter.CustomerId,
                Name = matter.Name,
                Description = matter.Description,
                CaseType = matter.CaseType,
                Status = matter.Status,
                StartDate = matter.StartDate,
                CreatedAt = matter.CreatedAt,
                UpdatedAt = matter.UpdatedAt,
                CustomerName = matter.Customer?.Name
            };
        }
    }
}