using FluentAssertions;
using LegalSaasApi.DTOs;
using LegalSaasApi.Models;
using LegalSaasApi.Repositories.Interfaces;
using LegalSaasApi.Services;
using LegalSaasApi.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace LegalSaasApi.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockConfiguration = new Mock<IConfiguration>();
        
        // Setup JWT configuration
        _mockConfiguration.Setup(x => x["Jwt:Key"]).Returns("ThisIsASecretKeyForJWTTokenGenerationThatIsLongEnough");
        _mockConfiguration.Setup(x => x["Jwt:Issuer"]).Returns("TestIssuer");
        _mockConfiguration.Setup(x => x["Jwt:Audience"]).Returns("TestAudience");
        
        _authService = new AuthService(_mockUserRepository.Object, _mockConfiguration.Object);
    }

    [Fact]
    public async Task SignupAsync_WithValidData_ReturnsSuccessResult()
    {
        // Arrange
        var signupDto = new SignupRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe",
            FirmName = "Test Firm"
        };

        _mockUserRepository.Setup(x => x.EmailExistsAsync(signupDto.Email))
            .ReturnsAsync(false);
        
        _mockUserRepository.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync((User user) => 
            {
                user.Id = Guid.NewGuid();
                user.CreatedAt = DateTime.UtcNow;
                return user;
            });

        // Act
        var result = await _authService.SignupAsync(signupDto);

        // Assert
        result.Should().NotBeNull();
        result!.Token.Should().NotBeNullOrEmpty();
        result.User.Should().NotBeNull();
        result.User!.Email.Should().Be(signupDto.Email);
        result.User.FirstName.Should().Be(signupDto.FirstName);
        result.User.LastName.Should().Be(signupDto.LastName);
        
        _mockUserRepository.Verify(x => x.EmailExistsAsync(signupDto.Email), Times.Once);
        _mockUserRepository.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task SignupAsync_WithExistingEmail_ReturnsFailureResult()
    {
        // Arrange
        var signupDto = new SignupRequestDto
        {
            Email = "existing@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe",
            FirmName = "Test Firm"
        };

        _mockUserRepository.Setup(x => x.EmailExistsAsync(signupDto.Email))
            .ReturnsAsync(true);

        // Act
        var result = await _authService.SignupAsync(signupDto);

        // Assert
        result.Should().BeNull();
        
        _mockUserRepository.Verify(x => x.EmailExistsAsync(signupDto.Email), Times.Once);
        _mockUserRepository.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsSuccessResult()
    {
        // Arrange
        var loginDto = new LoginRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Email = loginDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(loginDto.Password),
            FirstName = "John",
            LastName = "Doe",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepository.Setup(x => x.GetByEmailAsync(loginDto.Email))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        result.Should().NotBeNull();
        result!.Token.Should().NotBeNullOrEmpty();
        result.User.Should().NotBeNull();
        result.User!.Email.Should().Be(loginDto.Email);
        
        _mockUserRepository.Verify(x => x.GetByEmailAsync(loginDto.Email), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ReturnsFailureResult()
    {
        // Arrange
        var loginDto = new LoginRequestDto
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        _mockUserRepository.Setup(x => x.GetByEmailAsync(loginDto.Email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        result.Should().BeNull();
        
        _mockUserRepository.Verify(x => x.GetByEmailAsync(loginDto.Email), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ReturnsFailureResult()
    {
        // Arrange
        var loginDto = new LoginRequestDto
        {
            Email = "test@example.com",
            Password = "WrongPassword"
        };

        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Email = loginDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword"),
            FirstName = "John",
            LastName = "Doe",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepository.Setup(x => x.GetByEmailAsync(loginDto.Email))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        result.Should().BeNull();
        
        _mockUserRepository.Verify(x => x.GetByEmailAsync(loginDto.Email), Times.Once);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = "test@example.com",
            PasswordHash = "hashedpassword",
            FirstName = "John",
            LastName = "Doe",
            CreatedAt = DateTime.UtcNow
        };

        _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.GetUserByIdAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(userId);
        result.Email.Should().Be(user.Email);
        result.FirstName.Should().Be(user.FirstName);
        result.LastName.Should().Be(user.LastName);
        
        _mockUserRepository.Verify(x => x.GetByIdAsync(userId), Times.Once);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.GetUserByIdAsync(userId);

        // Assert
        result.Should().BeNull();
        
        _mockUserRepository.Verify(x => x.GetByIdAsync(userId), Times.Once);
    }

    [Theory]
    [InlineData("", "Password123!", "John", "Doe")]
    [InlineData("invalid-email", "Password123!", "John", "Doe")]
    [InlineData("test@example.com", "", "John", "Doe")]
    [InlineData("test@example.com", "123", "John", "Doe")]
    [InlineData("test@example.com", "Password123!", "", "Doe")]
    [InlineData("test@example.com", "Password123!", "John", "")]
    public async Task SignupAsync_WithInvalidData_ThrowsArgumentException(string email, string password, string firstName, string lastName)
    {
        // Arrange
        var signupDto = new SignupRequestDto
        {
            Email = email,
            Password = password,
            FirstName = firstName,
            LastName = lastName,
            FirmName = "Test Firm"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _authService.SignupAsync(signupDto));
    }

    [Theory]
    [InlineData("", "Password123!")]
    [InlineData("invalid-email", "Password123!")]
    [InlineData("test@example.com", "")]
    public async Task LoginAsync_WithInvalidData_ThrowsArgumentException(string email, string password)
    {
        // Arrange
        var loginDto = new LoginRequestDto
        {
            Email = email,
            Password = password
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _authService.LoginAsync(loginDto));
    }

    [Fact]
    public async Task SignupAsync_PasswordIsHashedCorrectly()
    {
        // Arrange
        var signupDto = new SignupRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe",
            FirmName = "Test Firm"
        };

        User? capturedUser = null;
        _mockUserRepository.Setup(x => x.EmailExistsAsync(signupDto.Email))
            .ReturnsAsync(false);
        
        _mockUserRepository.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .Callback<User>(user => capturedUser = user)
            .ReturnsAsync((User user) => 
            {
                user.Id = Guid.NewGuid();
                user.CreatedAt = DateTime.UtcNow;
                return user;
            });

        // Act
        await _authService.SignupAsync(signupDto);

        // Assert
        capturedUser.Should().NotBeNull();
        capturedUser!.PasswordHash.Should().NotBe(signupDto.Password);
        BCrypt.Net.BCrypt.Verify(signupDto.Password, capturedUser.PasswordHash).Should().BeTrue();
    }
}