using Microsoft.EntityFrameworkCore;
using LegalSaasApi.Models;

namespace LegalSaasApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Matter> Matters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasMany(u => u.Customers)
                      .WithOne(c => c.User)
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Customer entity
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Name);
                entity.HasMany(c => c.Matters)
                      .WithOne(m => m.Customer)
                      .HasForeignKey(m => m.CustomerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Matter entity
            modelBuilder.Entity<Matter>(entity =>
            {
                entity.HasIndex(e => e.CustomerId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.StartDate);
            });

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var adminUserId = Guid.NewGuid();
            var customer1Id = Guid.NewGuid();
            var customer2Id = Guid.NewGuid();

            // Seed admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminUserId,
                    Email = "admin@lawfirm.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    FirstName = "John",
                    LastName = "Doe",
                    FirmName = "Doe & Associates Law Firm",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed customers
            modelBuilder.Entity<Customer>().HasData(
                new Customer
                {
                    Id = customer1Id,
                    UserId = adminUserId,
                    Name = "Jane Smith",
                    PhoneNumber = "555-0123",
                    Email = "jane.smith@email.com",
                    Address = "123 Main St, City, State 12345",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Customer
                {
                    Id = customer2Id,
                    UserId = adminUserId,
                    Name = "Robert Johnson",
                    PhoneNumber = "555-0456",
                    Email = "robert.j@email.com",
                    Address = "456 Oak Ave, City, State 12345",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed matters
            modelBuilder.Entity<Matter>().HasData(
                new Matter
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customer1Id,
                    Name = "Divorce Proceedings",
                    Description = "Contested divorce case with child custody issues",
                    CaseType = "Family Law",
                    Status = "Active",
                    StartDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Matter
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customer2Id,
                    Name = "Contract Dispute",
                    Description = "Business contract breach case",
                    CaseType = "Business Law",
                    Status = "Active",
                    StartDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}