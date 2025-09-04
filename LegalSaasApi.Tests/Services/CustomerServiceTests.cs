using FluentAssertions;
using LegalSaasApi.DTOs;
using LegalSaasApi.Models;
using LegalSaasApi.Repositories.Interfaces;
using LegalSaasApi.Services;
using LegalSaasApi.Services.Interfaces;
using Moq;
using Xunit;

namespace LegalSaasApi.Tests.Services;

public class CustomerServiceTests
{
    private readonly Mock<ICustomerRepository> _mockCustomerRepository;
    private readonly CustomerService _customerService;
    private readonly Guid _testUserId;

    public CustomerServiceTests()
    {
        _mockCustomerRepository = new Mock<ICustomerRepository>();
        _customerService = new CustomerService(_mockCustomerRepository.Object);
        _testUserId = Guid.NewGuid();
    }

    [Fact]
    public async Task GetCustomersAsync_WithValidUserId_ReturnsCustomers()
    {
        // Arrange
        var customers = new List<Customer>
        {
            new Customer
            {
                Id = Guid.NewGuid(),
                UserId = _testUserId,
                Name = "Customer 1",
                Email = "customer1@example.com",
                PhoneNumber = "123-456-7890",
                Address = "123 Main St",
                CreatedAt = DateTime.UtcNow
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                UserId = _testUserId,
                Name = "Customer 2",
                Email = "customer2@example.com",
                PhoneNumber = "098-765-4321",
                Address = "456 Oak Ave",
                CreatedAt = DateTime.UtcNow
            }
        };

        _mockCustomerRepository.Setup(x => x.GetByUserIdAsync(_testUserId))
            .ReturnsAsync(customers);

        // Act
        var result = await _customerService.GetCustomersAsync(_testUserId);

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(c => c.Name == "Customer 1");
        result.Should().Contain(c => c.Name == "Customer 2");
        
        _mockCustomerRepository.Verify(x => x.GetByUserIdAsync(_testUserId), Times.Once);
    }

    [Fact]
    public async Task GetCustomersAsync_WithNoCustomers_ReturnsEmptyList()
    {
        // Arrange
        _mockCustomerRepository.Setup(x => x.GetByUserIdAsync(_testUserId))
            .ReturnsAsync(new List<Customer>());

        // Act
        var result = await _customerService.GetCustomersAsync(_testUserId);

        // Assert
        result.Should().BeEmpty();
        
        _mockCustomerRepository.Verify(x => x.GetByUserIdAsync(_testUserId), Times.Once);
    }

    [Fact]
    public async Task GetCustomerByIdAsync_WithValidId_ReturnsCustomer()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var customer = new Customer
        {
            Id = customerId,
            UserId = _testUserId,
            Name = "Test Customer",
            Email = "test@example.com",
            PhoneNumber = "123-456-7890",
            Address = "123 Main St",
            CreatedAt = DateTime.UtcNow
        };

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(customerId, _testUserId))
            .ReturnsAsync(customer);

        // Act
        var result = await _customerService.GetCustomerByIdAsync(customerId, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(customerId);
        result.Name.Should().Be("Test Customer");
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(customerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task GetCustomerByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var customerId = Guid.NewGuid();

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(customerId, _testUserId))
            .ReturnsAsync((Customer?)null);

        // Act
        var result = await _customerService.GetCustomerByIdAsync(customerId, _testUserId);

        // Assert
        result.Should().BeNull();
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(customerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task GetCustomerByIdAsync_WithValidId_ReturnsCustomerWithMatters()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var customer = new Customer
        {
            Id = customerId,
            UserId = _testUserId,
            Name = "Test Customer",
            Email = "test@example.com",
            PhoneNumber = "123-456-7890",
            Address = "123 Main St",
            CreatedAt = DateTime.UtcNow,
            Matters = new List<Matter>
            {
                new Matter
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customerId,
                    Name = "Matter 1",
                    Description = "Test matter 1",
                    Status = "Open",
                    CreatedAt = DateTime.UtcNow
                }
            }
        };

        _mockCustomerRepository.Setup(x => x.GetByIdWithMattersAsync(customerId, _testUserId))
            .ReturnsAsync(customer);

        // Act
        var result = await _customerService.GetCustomerByIdAsync(customerId, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(customerId);
        result.Matters.Should().HaveCount(1);
        result.Matters.First().Name.Should().Be("Matter 1");
        
        _mockCustomerRepository.Verify(x => x.GetByIdWithMattersAsync(customerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task CreateCustomerAsync_WithValidData_ReturnsCreatedCustomer()
    {
        // Arrange
        var createDto = new CreateCustomerDto
        {
            Name = "New Customer",
            Email = "new@example.com",
            PhoneNumber = "555-123-4567",
            Address = "789 Pine St"
        };

        var createdCustomer = new Customer
        {
            Id = Guid.NewGuid(),
            UserId = _testUserId,
            Name = createDto.Name,
            Email = createDto.Email,
            PhoneNumber = createDto.PhoneNumber,
            Address = createDto.Address,
            CreatedAt = DateTime.UtcNow
        };

        _mockCustomerRepository.Setup(x => x.CreateAsync(It.IsAny<Customer>()))
            .ReturnsAsync(createdCustomer);

        // Act
        var result = await _customerService.CreateCustomerAsync(createDto, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(createDto.Name);
        result.Email.Should().Be(createDto.Email);
        result.PhoneNumber.Should().Be(createDto.PhoneNumber);
        result.Address.Should().Be(createDto.Address);
        
        _mockCustomerRepository.Verify(x => x.CreateAsync(It.Is<Customer>(c => 
            c.Name == createDto.Name &&
            c.Email == createDto.Email &&
            c.PhoneNumber == createDto.PhoneNumber &&
            c.Address == createDto.Address &&
            c.UserId == _testUserId)), Times.Once);
    }

    [Fact]
    public async Task UpdateCustomerAsync_WithValidData_ReturnsUpdatedCustomer()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var updateDto = new UpdateCustomerDto
        {
            Name = "Updated Customer",
            Email = "updated@example.com",
            PhoneNumber = "555-987-6543",
            Address = "321 Elm St"
        };

        var existingCustomer = new Customer
        {
            Id = customerId,
            UserId = _testUserId,
            Name = "Original Customer",
            Email = "original@example.com",
            PhoneNumber = "123-456-7890",
            Address = "123 Main St",
            CreatedAt = DateTime.UtcNow
        };

        var updatedCustomer = new Customer
        {
            Id = customerId,
            UserId = _testUserId,
            Name = updateDto.Name,
            Email = updateDto.Email,
            PhoneNumber = updateDto.PhoneNumber,
            Address = updateDto.Address,
            CreatedAt = existingCustomer.CreatedAt
        };

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(customerId, _testUserId))
            .ReturnsAsync(existingCustomer);
        
        _mockCustomerRepository.Setup(x => x.UpdateAsync(It.IsAny<Customer>()))
            .ReturnsAsync(updatedCustomer);

        // Act
        var result = await _customerService.UpdateCustomerAsync(customerId, updateDto, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be(updateDto.Name);
        result.Email.Should().Be(updateDto.Email);
        result.PhoneNumber.Should().Be(updateDto.PhoneNumber);
        result.Address.Should().Be(updateDto.Address);
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(customerId, _testUserId), Times.Once);
        _mockCustomerRepository.Verify(x => x.UpdateAsync(It.Is<Customer>(c => 
            c.Id == customerId &&
            c.Name == updateDto.Name &&
            c.Email == updateDto.Email &&
            c.PhoneNumber == updateDto.PhoneNumber &&
            c.Address == updateDto.Address)), Times.Once);
    }

    [Fact]
    public async Task UpdateCustomerAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var updateDto = new UpdateCustomerDto
        {
            Name = "Updated Customer",
            Email = "updated@example.com",
            PhoneNumber = "555-987-6543",
            Address = "321 Elm St"
        };

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(customerId, _testUserId))
            .ReturnsAsync((Customer?)null);

        // Act
        var result = await _customerService.UpdateCustomerAsync(customerId, updateDto, _testUserId);

        // Assert
        result.Should().BeNull();
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(customerId, _testUserId), Times.Once);
        _mockCustomerRepository.Verify(x => x.UpdateAsync(It.IsAny<Customer>()), Times.Never);
    }

    [Fact]
    public async Task DeleteCustomerAsync_WithValidId_ReturnsTrue()
    {
        // Arrange
        var customerId = Guid.NewGuid();

        _mockCustomerRepository.Setup(x => x.DeleteAsync(customerId, _testUserId))
            .ReturnsAsync(true);

        // Act
        var result = await _customerService.DeleteCustomerAsync(customerId, _testUserId);

        // Assert
        result.Should().BeTrue();
        
        _mockCustomerRepository.Verify(x => x.DeleteAsync(customerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task DeleteCustomerAsync_WithInvalidId_ReturnsFalse()
    {
        // Arrange
        var customerId = Guid.NewGuid();

        _mockCustomerRepository.Setup(x => x.DeleteAsync(customerId, _testUserId))
            .ReturnsAsync(false);

        // Act
        var result = await _customerService.DeleteCustomerAsync(customerId, _testUserId);

        // Assert
        result.Should().BeFalse();
        
        _mockCustomerRepository.Verify(x => x.DeleteAsync(customerId, _testUserId), Times.Once);
    }

    [Theory]
    [InlineData("", "test@example.com", "123-456-7890", "123 Main St")]
    [InlineData("Test Customer", "", "123-456-7890", "123 Main St")]
    [InlineData("Test Customer", "invalid-email", "123-456-7890", "123 Main St")]
    public async Task CreateCustomerAsync_WithInvalidData_ThrowsArgumentException(string name, string email, string phone, string address)
    {
        // Arrange
        var createDto = new CreateCustomerDto
        {
            Name = name,
            Email = email,
            PhoneNumber = phone,
            Address = address
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _customerService.CreateCustomerAsync(createDto, _testUserId));
    }

    [Theory]
    [InlineData("", "test@example.com", "123-456-7890", "123 Main St")]
    [InlineData("Test Customer", "", "123-456-7890", "123 Main St")]
    [InlineData("Test Customer", "invalid-email", "123-456-7890", "123 Main St")]
    public async Task UpdateCustomerAsync_WithInvalidData_ThrowsArgumentException(string name, string email, string phone, string address)
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var updateDto = new UpdateCustomerDto
        {
            Name = name,
            Email = email,
            PhoneNumber = phone,
            Address = address
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _customerService.UpdateCustomerAsync(customerId, updateDto, _testUserId));
    }
}