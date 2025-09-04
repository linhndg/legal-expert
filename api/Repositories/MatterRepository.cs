using Microsoft.EntityFrameworkCore;
using LegalSaasApi.Data;
using LegalSaasApi.Models;
using LegalSaasApi.Repositories.Interfaces;

namespace LegalSaasApi.Repositories
{
    public class MatterRepository : IMatterRepository
    {
        private readonly ApplicationDbContext _context;

        public MatterRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Matter>> GetByCustomerIdAsync(Guid customerId, Guid userId)
        {
            // Verify customer belongs to user first
            var customerExists = await _context.Customers
                .AnyAsync(c => c.Id == customerId && c.UserId == userId);

            if (!customerExists)
                return new List<Matter>();

            return await _context.Matters
                .Where(m => m.CustomerId == customerId)
                .Include(m => m.Customer)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<Matter?> GetByIdAsync(Guid id, Guid customerId, Guid userId)
        {
            return await _context.Matters
                .Where(m => m.Id == id && m.CustomerId == customerId)
                .Include(m => m.Customer)
                .Where(m => m.Customer.UserId == userId)
                .FirstOrDefaultAsync();
        }

        public async Task<Matter> CreateAsync(Matter matter)
        {
            _context.Matters.Add(matter);
            await _context.SaveChangesAsync();
            return matter;
        }

        public async Task<Matter> UpdateAsync(Matter matter)
        {
            _context.Matters.Update(matter);
            await _context.SaveChangesAsync();
            return matter;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid customerId, Guid userId)
        {
            var matter = await _context.Matters
                .Where(m => m.Id == id && m.CustomerId == customerId)
                .Include(m => m.Customer)
                .Where(m => m.Customer.UserId == userId)
                .FirstOrDefaultAsync();

            if (matter == null)
                return false;

            _context.Matters.Remove(matter);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id, Guid customerId, Guid userId)
        {
            return await _context.Matters
                .Where(m => m.Id == id && m.CustomerId == customerId)
                .Include(m => m.Customer)
                .AnyAsync(m => m.Customer.UserId == userId);
        }
    }
}