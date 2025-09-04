using LegalSaasApi.Models;
using LegalSaasApi.DTOs;
using LegalSaasApi.Repositories.Interfaces;
using LegalSaasApi.Services.Interfaces;

namespace LegalSaasApi.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<List<CustomerDto>> GetCustomersAsync(Guid userId)
        {
            var customers = await _customerRepository.GetByUserIdAsync(userId);
            return customers.Select(MapToCustomerDto).ToList();
        }

        public async Task<CustomerWithMattersDto?> GetCustomerByIdAsync(Guid customerId, Guid userId)
        {
            var customer = await _customerRepository.GetByIdWithMattersAsync(customerId, userId);

            if (customer == null)
                return null;

            return new CustomerWithMattersDto
            {
                Id = customer.Id,
                Name = customer.Name,
                PhoneNumber = customer.PhoneNumber,
                Email = customer.Email,
                Address = customer.Address,
                Notes = customer.Notes,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt,
                MattersCount = customer.Matters.Count,
                Matters = customer.Matters.Select(MapToMatterDto).ToList()
            };
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createDto, Guid userId)
        {
            var customer = new Customer
            {
                UserId = userId,
                Name = createDto.Name,
                PhoneNumber = createDto.PhoneNumber,
                Email = createDto.Email,
                Address = createDto.Address,
                Notes = createDto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdCustomer = await _customerRepository.CreateAsync(customer);
            return MapToCustomerDto(createdCustomer);
        }

        public async Task<CustomerDto?> UpdateCustomerAsync(Guid customerId, UpdateCustomerDto updateDto, Guid userId)
        {
            var customer = await _customerRepository.GetByIdWithMattersAsync(customerId, userId);

            if (customer == null)
                return null;

            customer.Name = updateDto.Name;
            customer.PhoneNumber = updateDto.PhoneNumber;
            customer.Email = updateDto.Email;
            customer.Address = updateDto.Address;
            customer.Notes = updateDto.Notes;
            customer.UpdatedAt = DateTime.UtcNow;

            var updatedCustomer = await _customerRepository.UpdateAsync(customer);
            return MapToCustomerDto(updatedCustomer);
        }

        public async Task<bool> DeleteCustomerAsync(Guid customerId, Guid userId)
        {
            return await _customerRepository.DeleteAsync(customerId, userId);
        }

        private static CustomerDto MapToCustomerDto(Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                PhoneNumber = customer.PhoneNumber,
                Email = customer.Email,
                Address = customer.Address,
                Notes = customer.Notes,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt,
                MattersCount = customer.Matters?.Count ?? 0
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
                CaseType = matter.CaseType,
                Status = matter.Status,
                StartDate = matter.StartDate,
                CreatedAt = matter.CreatedAt,
                UpdatedAt = matter.UpdatedAt
            };
        }
    }
}