using Microsoft.EntityFrameworkCore;
using LegalSaasApi.Data;
using LegalSaasApi.Models;
using LegalSaasApi.Repositories.Interfaces;

namespace LegalSaasApi.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;

        public CustomerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Customer>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Customers
                .Where(c => c.UserId == userId)
                .Include(c => c.Matters)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<Customer?> GetByIdAsync(Guid id, Guid userId)
        {
            return await _context.Customers
                .Where(c => c.Id == id && c.UserId == userId)
                .FirstOrDefaultAsync();
        }

        public async Task<Customer?> GetByIdWithMattersAsync(Guid id, Guid userId)
        {
            return await _context.Customers
                .Where(c => c.Id == id && c.UserId == userId)
                .Include(c => c.Matters)
                .FirstOrDefaultAsync();
        }

        public async Task<Customer> CreateAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer> UpdateAsync(Customer customer)
        {
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var customer = await _context.Customers
                .Where(c => c.Id == id && c.UserId == userId)
                .FirstOrDefaultAsync();

            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id, Guid userId)
        {
            return await _context.Customers
                .AnyAsync(c => c.Id == id && c.UserId == userId);
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _context.Customers
                .Where(c => c.Email == email && c.IsPortalEnabled)
                .FirstOrDefaultAsync();
        }

        public async Task<Customer?> GetByIdForPortalAsync(Guid id)
        {
            return await _context.Customers
                .Where(c => c.Id == id && c.IsPortalEnabled)
                .Include(c => c.Matters)
                .FirstOrDefaultAsync();
        }

        // Temporary debug method
        public async Task<List<Customer>> GetAllPortalCustomersAsync()
        {
            return await _context.Customers
                .Where(c => c.IsPortalEnabled)
                .ToListAsync();
        }
    }
}