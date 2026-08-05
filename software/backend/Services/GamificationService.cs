using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class GamificationService : IGamificationService
{
    private readonly AppDbContext _context;

    public GamificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<QuestCompletionResponseDto> ProcessQuestCompletionAsync(User user, Quest quest)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;

        // 1. Calculate Streak
        if (!user.LastActiveDate.HasValue)
        {
            user.StreakCount = 1;
        }
        else
        {
            var lastActiveDay = user.LastActiveDate.Value.Date;
            if (lastActiveDay == today.AddDays(-1))
            {
                // Yesterday -> streak increment
                user.StreakCount += 1;
            }
            else if (lastActiveDay < today.AddDays(-1))
            {
                // Missed day -> reset streak to 1
                user.StreakCount = 1;
            }
            // If lastActiveDay == today, streak count remains unchanged
        }

        user.LastActiveDate = now;

        // 2. Calculate Streak Multiplier
        double streakMultiplier = user.StreakCount switch
        {
            >= 30 => 2.0,
            >= 7 => 1.5,
            >= 3 => 1.2,
            _ => 1.0
        };

        // 3. XP & Level Up calculation
        int xpEarned = (int)Math.Round(quest.XPReward * streakMultiplier);
        user.CurrentXP += xpEarned;

        bool leveledUp = false;
        int initialLevel = user.Level;

        while (user.CurrentXP >= user.RequiredXP)
        {
            user.CurrentXP -= user.RequiredXP;
            user.Level += 1;
            user.RequiredXP = user.Level * 100;
            leveledUp = true;
        }

        // 4. Mark Quest Completed
        quest.IsCompleted = true;
        quest.CompletedAt = now;

        await _context.SaveChangesAsync();

        // 5. Evaluate Badges
        var newlyUnlockedBadges = await EvaluateAndUnlockBadgesAsync(user);

        await _context.SaveChangesAsync();

        var questDto = new QuestResponseDto
        {
            Id = quest.Id,
            UserId = quest.UserId,
            Title = quest.Title,
            Description = quest.Description,
            XPReward = quest.XPReward,
            Difficulty = quest.Difficulty,
            IsCompleted = quest.IsCompleted,
            DueDate = quest.DueDate,
            CompletedAt = quest.CompletedAt,
            CreatedAt = quest.CreatedAt
        };

        return new QuestCompletionResponseDto
        {
            Quest = questDto,
            XPEarned = xpEarned,
            StreakMultiplier = streakMultiplier,
            LeveledUp = leveledUp,
            NewLevel = user.Level,
            RankTier = user.RankTier,
            CurrentXP = user.CurrentXP,
            RequiredXP = user.RequiredXP,
            StreakCount = user.StreakCount,
            StreakFlameColor = user.StreakFlameColor,
            NewlyUnlockedBadges = newlyUnlockedBadges
        };
    }

    public async Task<List<BadgeDto>> GetUserBadgesAsync(Guid userId)
    {
        var allBadges = await _context.Badges.ToListAsync();
        var userBadges = await _context.UserBadges
            .Where(ub => ub.UserId == userId)
            .ToDictionaryAsync(ub => ub.BadgeId, ub => ub.UnlockedAt);

        return allBadges.Select(b => new BadgeDto
        {
            Id = b.Id,
            Name = b.Name,
            Description = b.Description,
            IconUrl = b.IconUrl,
            RequiredType = b.RequiredType,
            RequiredValue = b.RequiredValue,
            IsUnlocked = userBadges.ContainsKey(b.Id),
            UnlockedAt = userBadges.TryGetValue(b.Id, out var unlockedAt) ? unlockedAt : null
        }).ToList();
    }

    private async Task<List<BadgeDto>> EvaluateAndUnlockBadgesAsync(User user)
    {
        var newlyUnlocked = new List<BadgeDto>();

        var completedQuestCount = await _context.Quests
            .CountAsync(q => q.UserId == user.Id && q.IsCompleted);

        var existingBadgeIds = await _context.UserBadges
            .Where(ub => ub.UserId == user.Id)
            .Select(ub => ub.BadgeId)
            .ToListAsync();

        var catalogBadges = await _context.Badges.ToListAsync();

        foreach (var badge in catalogBadges)
        {
            if (existingBadgeIds.Contains(badge.Id)) continue;

            bool isEligible = badge.RequiredType switch
            {
                "QuestCount" => completedQuestCount >= badge.RequiredValue,
                "Level" => user.Level >= badge.RequiredValue,
                "Streak" => user.StreakCount >= badge.RequiredValue,
                _ => false
            };

            if (isEligible)
            {
                var userBadge = new UserBadge
                {
                    UserId = user.Id,
                    BadgeId = badge.Id,
                    UnlockedAt = DateTime.UtcNow
                };

                _context.UserBadges.Add(userBadge);

                newlyUnlocked.Add(new BadgeDto
                {
                    Id = badge.Id,
                    Name = badge.Name,
                    Description = badge.Description,
                    IconUrl = badge.IconUrl,
                    RequiredType = badge.RequiredType,
                    RequiredValue = badge.RequiredValue,
                    IsUnlocked = true,
                    UnlockedAt = userBadge.UnlockedAt
                });
            }
        }

        return newlyUnlocked;
    }
}
