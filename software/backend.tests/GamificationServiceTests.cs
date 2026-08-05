using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.Tests;

public class GamificationServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task ProcessQuestCompletion_AwardsXP_AndLevelsUp()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new GamificationService(context);

        var user = new User
        {
            Username = "TestHunter",
            Email = "hunter@test.com",
            Level = 1,
            CurrentXP = 80,
            RequiredXP = 100
        };
        context.Users.Add(user);

        var quest = new Quest
        {
            UserId = user.Id,
            Title = "Defeat Dungeon Boss",
            XPReward = 50,
            Difficulty = "Hard"
        };
        context.Quests.Add(quest);
        await context.SaveChangesAsync();

        // Act
        var result = await service.ProcessQuestCompletionAsync(user, quest);

        // Assert
        Assert.True(result.Quest.IsCompleted);
        Assert.True(result.LeveledUp);
        Assert.Equal(2, result.NewLevel);
        Assert.Equal("E-Rank", result.RankTier);
        Assert.Equal(30, result.CurrentXP); // 80 + 50 = 130 -> Level up -> 130 - 100 = 30
        Assert.Equal(200, result.RequiredXP); // Level 2 required XP = 200
    }

    [Fact]
    public async Task ProcessQuestCompletion_UnlocksFirstQuestBadge()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new GamificationService(context);

        var user = new User
        {
            Username = "BadgeHunter",
            Email = "badge@test.com"
        };
        context.Users.Add(user);

        var quest = new Quest
        {
            UserId = user.Id,
            Title = "First Habit Quest",
            XPReward = 50
        };
        context.Quests.Add(quest);
        await context.SaveChangesAsync();

        // Act
        var result = await service.ProcessQuestCompletionAsync(user, quest);

        // Assert
        Assert.NotEmpty(result.NewlyUnlockedBadges);
        Assert.Contains(result.NewlyUnlockedBadges, b => b.Name == "First Quest");
    }
}
