using Backend.Data;
using Backend.DTOs;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Backend.Tests;

public class AuthServiceTests
{
    private (AppDbContext context, IConfiguration config) GetInMemorySetup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();

        var inMemorySettings = new Dictionary<string, string?>
        {
            { "Jwt:SecretKey", "TestSuperSecretKeyForMSA2026UnitTest123456789!" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" },
            { "Jwt:ExpiryMinutes", "60" }
        };

        IConfiguration config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        return (context, config);
    }

    [Fact]
    public async Task RegisterAsync_CreatesUser_HashesPassword_ReturnsToken()
    {
        // Arrange
        var (context, config) = GetInMemorySetup();
        var service = new AuthService(context, config);

        var dto = new RegisterDto
        {
            Username = "SungJinWoo",
            Email = "jinwoo@shadow.com",
            Password = "ShadowMonarch123!"
        };

        // Act
        var result = await service.RegisterAsync(dto);

        // Assert
        Assert.NotNull(result.Token);
        Assert.Equal("SungJinWoo", result.Username);
        Assert.Equal("jinwoo@shadow.com", result.Email);

        var dbUser = await context.Users.FirstOrDefaultAsync(u => u.Id == result.UserId);
        Assert.NotNull(dbUser);
        Assert.NotEqual("ShadowMonarch123!", dbUser.PasswordHash);
    }

    [Fact]
    public async Task LoginAsync_ValidatesPassword_ReturnsToken()
    {
        // Arrange
        var (context, config) = GetInMemorySetup();
        var service = new AuthService(context, config);

        await service.RegisterAsync(new RegisterDto
        {
            Username = "ChaHaeIn",
            Email = "haein@association.com",
            Password = "SwordDance123!"
        });

        // Act
        var result = await service.LoginAsync(new LoginDto
        {
            UsernameOrEmail = "haein@association.com",
            Password = "SwordDance123!"
        });

        // Assert
        Assert.NotNull(result.Token);
        Assert.Equal("ChaHaeIn", result.Username);
    }
}
