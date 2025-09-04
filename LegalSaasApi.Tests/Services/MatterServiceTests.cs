using FluentAssertions;
using LegalSaasApi.DTOs;
using LegalSaasApi.Models;
using LegalSaasApi.Repositories.Interfaces;
using LegalSaasApi.Services;
using LegalSaasApi.Services.Interfaces;
using Moq;
using Xunit;

namespace LegalSaasApi.Tests.Services;

public class MatterServiceTests
{
    private readonly Mock<IMatterRepository> _mockMatterRepository;
    private readonly Mock<ICustomerRepository> _mockCustomerRepository;
    private readonly MatterService _matterService;
    private readonly Guid _testUserId;
    private readonly Guid _testCustomerId;

    public MatterServiceTests()
    {
        _mockMatterRepository = new Mock<IMatterRepository>();
        _mockCustomerRepository = new Mock<ICustomerRepository>();
        _matterService = new MatterService(_mockMatterRepository.Object, _mockCustomerRepository.Object);
        _testUserId = Guid.NewGuid();
        _testCustomerId = Guid.NewGuid();
    }

    [Fact]
    public async Task GetMattersAsync_WithValidCustomerId_ReturnsMatters()
    {
        // Arrange
        var matters = new List<Matter>
        {
            new Matter
            {
                Id = Guid.NewGuid(),
                CustomerId = _testCustomerId,
                Name = "Matter 1",
                Description = "Test matter 1",
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            },
            new Matter
            {
                Id = Guid.NewGuid(),
                CustomerId = _testCustomerId,
                Name = "Matter 2",
                Description = "Test matter 2",
                Status = "Closed",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        _mockCustomerRepository.Setup(x => x.ExistsAsync(_testCustomerId, _testUserId))
            .ReturnsAsync(true);
        _mockMatterRepository.Setup(x => x.GetByCustomerIdAsync(_testCustomerId, _testUserId))
            .ReturnsAsync(matters);

        // Act
        var result = await _matterService.GetMattersAsync(_testCustomerId, _testUserId);

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(m => m.Name == "Matter 1");
        result.Should().Contain(m => m.Name == "Matter 2");
        
        _mockMatterRepository.Verify(x => x.GetByCustomerIdAsync(_testCustomerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task GetMattersAsync_WithNoMatters_ReturnsEmptyList()
    {
        // Arrange
        _mockCustomerRepository.Setup(x => x.ExistsAsync(_testCustomerId, _testUserId))
            .ReturnsAsync(true);
        _mockMatterRepository.Setup(x => x.GetByCustomerIdAsync(_testCustomerId, _testUserId))
            .ReturnsAsync(new List<Matter>());

        // Act
        var result = await _matterService.GetMattersAsync(_testCustomerId, _testUserId);

        // Assert
        result.Should().BeEmpty();
        
        _mockMatterRepository.Verify(x => x.GetByCustomerIdAsync(_testCustomerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task GetMatterByIdAsync_WithValidId_ReturnsMatter()
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var matter = new Matter
        {
            Id = matterId,
            CustomerId = _testCustomerId,
            Name = "Test Matter",
            Description = "Test description",
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        _mockMatterRepository.Setup(x => x.GetByIdAsync(matterId, _testCustomerId, _testUserId))
            .ReturnsAsync(matter);

        // Act
        var result = await _matterService.GetMatterByIdAsync(_testCustomerId, matterId, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(matterId);
        result.Name.Should().Be("Test Matter");
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(matterId, _testCustomerId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task GetMatterByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var matterId = Guid.NewGuid();

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync((Matter?)null);

        // Act
        var result = await _matterService.GetMatterByIdAsync(_testCustomerId, matterId, _testUserId);

        // Assert
        result.Should().BeNull();
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task CreateMatterAsync_WithValidData_ReturnsCreatedMatter()
    {
        // Arrange
        var createDto = new CreateMatterDto
        {
            Name = "Test Matter",
            Description = "Test description",
            Status = "Open"
        };

        var customer = new Customer
        {
            Id = _testCustomerId,
            UserId = _testUserId,
            Name = "Test Customer",
            Email = "test@example.com",
            PhoneNumber = "123-456-7890",
            Address = "123 Main St",
            CreatedAt = DateTime.UtcNow
        };

        var createdMatter = new Matter
        {
            Id = Guid.NewGuid(),
            CustomerId = _testCustomerId,
            Name = createDto.Name,
            Description = createDto.Description,
            Status = createDto.Status,
            CreatedAt = DateTime.UtcNow
        };

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(_testCustomerId, _testUserId))
            .ReturnsAsync(customer);
        
        _mockMatterRepository.Setup(x => x.CreateAsync(It.IsAny<Matter>()))
            .ReturnsAsync(createdMatter);

        // Act
        var result = await _matterService.CreateMatterAsync(_testCustomerId, createDto, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be(createDto.Name);
        result.Description.Should().Be(createDto.Description);
        result.Status.Should().Be(createDto.Status);
        result.CustomerId.Should().Be(_testCustomerId);
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(_testCustomerId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.CreateAsync(It.Is<Matter>(m => 
            m.CustomerId == _testCustomerId &&
            m.Name == createDto.Name &&
            m.Description == createDto.Description &&
            m.Status == createDto.Status)), Times.Once);
    }

    [Fact]
    public async Task CreateMatterAsync_WithInvalidCustomerId_ThrowsArgumentException()
    {
        // Arrange
        var createDto = new CreateMatterDto
        {
            Name = "New Matter",
            Description = "New matter description",
            Status = "Open"
        };

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(_testCustomerId, _testUserId))
            .ReturnsAsync((Customer?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => 
            _matterService.CreateMatterAsync(_testCustomerId, createDto, _testUserId));
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(_testCustomerId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.CreateAsync(It.IsAny<Matter>()), Times.Never);
    }

    [Fact]
    public async Task CreateMatterAsync_WithCustomerNotOwnedByUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var createDto = new CreateMatterDto
        {
            Name = "New Matter",
            Description = "New matter description",
            Status = "Open"
        };

        var customer = new Customer
        {
            Id = _testCustomerId,
            UserId = Guid.NewGuid(), // Different user ID
            Name = "Test Customer",
            Email = "test@example.com",
            PhoneNumber = "123-456-7890",
            Address = "123 Main St",
            CreatedAt = DateTime.UtcNow
        };

        _mockCustomerRepository.Setup(x => x.GetByIdAsync(_testCustomerId, _testUserId))
            .ReturnsAsync(customer);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => 
            _matterService.CreateMatterAsync(_testCustomerId, createDto, _testUserId));
        
        _mockCustomerRepository.Verify(x => x.GetByIdAsync(_testCustomerId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.CreateAsync(It.IsAny<Matter>()), Times.Never);
    }

    [Fact]
    public async Task UpdateMatterAsync_WithValidData_ReturnsUpdatedMatter()
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var updateDto = new UpdateMatterDto
        {
            Name = "Updated Matter",
            Description = "Updated description",
            Status = "Closed"
        };

        var existingMatter = new Matter
        {
            Id = matterId,
            CustomerId = _testCustomerId,
            Name = "Original Matter",
            Description = "Original description",
            Status = "Open",
            CreatedAt = DateTime.UtcNow,
            Customer = new Customer
            {
                Id = _testCustomerId,
                UserId = _testUserId,
                Name = "Test Customer",
                Email = "test@example.com",
                PhoneNumber = "123-456-7890",
                Address = "123 Main St",
                CreatedAt = DateTime.UtcNow
            }
        };

        var updatedMatter = new Matter
        {
            Id = matterId,
            CustomerId = _testCustomerId,
            Name = updateDto.Name,
            Description = updateDto.Description,
            Status = updateDto.Status,
            CreatedAt = existingMatter.CreatedAt
        };

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync(existingMatter);
        
        _mockMatterRepository.Setup(x => x.UpdateAsync(It.IsAny<Matter>()))
            .ReturnsAsync(updatedMatter);

        // Act
        var result = await _matterService.UpdateMatterAsync(_testCustomerId, matterId, updateDto, _testUserId);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be(updateDto.Name);
        result.Description.Should().Be(updateDto.Description);
        result.Status.Should().Be(updateDto.Status);
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.UpdateAsync(It.Is<Matter>(m => 
            m.Id == matterId &&
            m.Name == updateDto.Name &&
            m.Description == updateDto.Description &&
            m.Status == updateDto.Status)), Times.Once);
    }

    [Fact]
    public async Task UpdateMatterAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var updateDto = new UpdateMatterDto
        {
            Name = "Updated Matter",
            Description = "Updated description",
            Status = "Closed"
        };

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync((Matter?)null);

        // Act
        var result = await _matterService.UpdateMatterAsync(_testCustomerId, matterId, updateDto, _testUserId);

        // Assert
        result.Should().BeNull();
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.UpdateAsync(It.IsAny<Matter>()), Times.Never);
    }

    [Fact]
    public async Task UpdateMatterAsync_WithMatterNotOwnedByUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var updateDto = new UpdateMatterDto
        {
            Name = "Updated Matter",
            Description = "Updated description",
            Status = "Closed"
        };

        var existingMatter = new Matter
        {
            Id = matterId,
            CustomerId = _testCustomerId,
            Name = "Original Matter",
            Description = "Original description",
            Status = "Open",
            CreatedAt = DateTime.UtcNow,
            Customer = new Customer
            {
                Id = _testCustomerId,
                UserId = Guid.NewGuid(), // Different user ID
                Name = "Test Customer",
                Email = "test@example.com",
                PhoneNumber = "123-456-7890",
                Address = "123 Main St",
                CreatedAt = DateTime.UtcNow
            }
        };

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync(existingMatter);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => 
            _matterService.UpdateMatterAsync(_testCustomerId, matterId, updateDto, _testUserId));
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.UpdateAsync(It.IsAny<Matter>()), Times.Never);
    }

    [Fact]
    public async Task DeleteMatterAsync_WithValidId_ReturnsTrue()
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var existingMatter = new Matter
        {
            Id = matterId,
            CustomerId = _testCustomerId,
            Name = "Test Matter",
            Description = "Test description",
            Status = "Open",
            CreatedAt = DateTime.UtcNow,
            Customer = new Customer
            {
                Id = _testCustomerId,
                UserId = _testUserId,
                Name = "Test Customer",
                Email = "test@example.com",
                PhoneNumber = "123-456-7890",
                Address = "123 Main St",
                CreatedAt = DateTime.UtcNow
            }
        };

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync(existingMatter);
        
        _mockMatterRepository.Setup(x => x.DeleteAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync(true);

        // Act
        var result = await _matterService.DeleteMatterAsync(_testCustomerId, matterId, _testUserId);

        // Assert
        result.Should().BeTrue();
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.DeleteAsync(_testCustomerId, matterId, _testUserId), Times.Once);
    }

    [Fact]
    public async Task DeleteMatterAsync_WithInvalidId_ReturnsFalse()
    {
        // Arrange
        var matterId = Guid.NewGuid();

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync((Matter?)null);

        // Act
        var result = await _matterService.DeleteMatterAsync(_testCustomerId, matterId, _testUserId);

        // Assert
        result.Should().BeFalse();
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.DeleteAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task DeleteMatterAsync_WithMatterNotOwnedByUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var existingMatter = new Matter
        {
            Id = matterId,
            CustomerId = _testCustomerId,
            Name = "Test Matter",
            Description = "Test description",
            Status = "Open",
            CreatedAt = DateTime.UtcNow,
            Customer = new Customer
            {
                Id = _testCustomerId,
                UserId = Guid.NewGuid(), // Different user ID
                Name = "Test Customer",
                Email = "test@example.com",
                PhoneNumber = "123-456-7890",
                Address = "123 Main St",
                CreatedAt = DateTime.UtcNow
            }
        };

        _mockMatterRepository.Setup(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId))
            .ReturnsAsync(existingMatter);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => 
            _matterService.DeleteMatterAsync(_testCustomerId, matterId, _testUserId));
        
        _mockMatterRepository.Verify(x => x.GetByIdAsync(_testCustomerId, matterId, _testUserId), Times.Once);
        _mockMatterRepository.Verify(x => x.DeleteAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
    }

    [Theory]
    [InlineData("", "Test description", "Open")]
    [InlineData("Test Matter", "", "Open")]
    [InlineData("Test Matter", "Test description", "")]
    public async Task CreateMatterAsync_WithInvalidData_ThrowsArgumentException(string title, string description, string status)
    {
        // Arrange
        var createDto = new CreateMatterDto
        {
            Name = title,
            Description = description,
            Status = status
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => 
            _matterService.CreateMatterAsync(_testCustomerId, createDto, _testUserId));
    }

    [Theory]
    [InlineData("", "Test description", "Open")]
    [InlineData("Test Matter", "", "Open")]
    [InlineData("Test Matter", "Test description", "")]
    public async Task UpdateMatterAsync_WithInvalidData_ThrowsArgumentException(string title, string description, string status)
    {
        // Arrange
        var matterId = Guid.NewGuid();
        var updateDto = new UpdateMatterDto
        {
            Name = title,
            Description = description,
            Status = status
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => 
            _matterService.UpdateMatterAsync(_testCustomerId, matterId, updateDto, _testUserId));
    }
}