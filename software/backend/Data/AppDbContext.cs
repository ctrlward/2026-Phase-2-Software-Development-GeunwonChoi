using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

/// <summary>
/// Entity Framework Core database context managing database sets, constraints, and seed data.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Quest> Quests => Set<Quest>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure unique indexes for User entity
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Seed initial badge catalog
        modelBuilder.Entity<Badge>().HasData(
            new Badge
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "First Quest",
                Description = "Complete your very first quest",
                IconUrl = "/icons/badge_first.png",
                RequiredType = "QuestCount",
                RequiredValue = 1
            },
            new Badge
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Quest Hunter",
                Description = "Complete 10 quests",
                IconUrl = "/icons/badge_hunter.png",
                RequiredType = "QuestCount",
                RequiredValue = 10
            },
            new Badge
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Veteran Hunter",
                Description = "Complete 50 quests",
                IconUrl = "/icons/badge_veteran.png",
                RequiredType = "QuestCount",
                RequiredValue = 50
            },
            new Badge
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "E-Rank Awakening",
                Description = "Reach Level 2",
                IconUrl = "/icons/badge_erank.png",
                RequiredType = "Level",
                RequiredValue = 2
            },
            new Badge
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "S-Rank Monarch",
                Description = "Reach Level 50",
                IconUrl = "/icons/badge_monarch.png",
                RequiredType = "Level",
                RequiredValue = 50
            },
            new Badge
            {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Name = "Spark of Persistence",
                Description = "Maintain a 3-day streak",
                IconUrl = "/icons/badge_spark.png",
                RequiredType = "Streak",
                RequiredValue = 3
            },
            new Badge
            {
                Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Name = "On Fire",
                Description = "Maintain a 7-day streak",
                IconUrl = "/icons/badge_fire.png",
                RequiredType = "Streak",
                RequiredValue = 7
            },
            new Badge
            {
                Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                Name = "Unstoppable Flame",
                Description = "Maintain a 30-day streak",
                IconUrl = "/icons/badge_unstoppable.png",
                RequiredType = "Streak",
                RequiredValue = 30
            }
        );

        // Seed default system administrator user
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                Username = "system_admin",
                Email = "admin@levelingalone.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("AdminPassword123!"),
                Role = "Admin",
                Level = 100,
                CurrentXP = 0,
                RequiredXP = 10000,
                StreakCount = 99,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
