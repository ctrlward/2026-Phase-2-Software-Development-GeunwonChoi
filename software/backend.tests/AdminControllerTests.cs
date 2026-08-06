using System.Security.Claims;
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.Tests;

public class AdminControllerTests
{
    private AppDbContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    private AdminController CreateControllerWithAdminUser(AppDbContext context, Guid adminId)
    {
        var controller = new AdminController(context);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, adminId.ToString()),
            new Claim(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        return controller;
    }

    [Fact]
    public async Task GetAllUsers_ReturnsAllRegisteredUsers()
    {
        // Arrange
        var context = GetInMemoryContext();
        var adminId = Guid.NewGuid();
        context.Users.Add(new User { Id = adminId, Username = "admin_user", Email = "admin@test.com", Role = "Admin" });
        context.Users.Add(new User { Id = Guid.NewGuid(), Username = "user_one", Email = "user1@test.com", Role = "User" });
        await context.SaveChangesAsync();

        var controller = CreateControllerWithAdminUser(context, adminId);

        // Act
        var result = await controller.GetAllUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var users = Assert.IsAssignableFrom<List<DTOs.UserProfileDto>>(okResult.Value);
        Assert.True(users.Count >= 2);
    }

    [Fact]
    public async Task DeleteUser_RemovesTargetUserAccount()
    {
        // Arrange
        var context = GetInMemoryContext();
        var adminId = Guid.NewGuid();
        var targetUserId = Guid.NewGuid();

        context.Users.Add(new User { Id = adminId, Username = "admin_user", Email = "admin@test.com", Role = "Admin" });
        context.Users.Add(new User { Id = targetUserId, Username = "spammer", Email = "spam@test.com", Role = "User" });
        await context.SaveChangesAsync();

        var controller = CreateControllerWithAdminUser(context, adminId);

        // Act
        var result = await controller.DeleteUser(targetUserId);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var deletedUser = await context.Users.FirstOrDefaultAsync(u => u.Id == targetUserId);
        Assert.Null(deletedUser);
    }
}
