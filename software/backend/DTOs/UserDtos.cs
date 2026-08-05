namespace Backend.DTOs;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int Level { get; set; }
    public int CurrentXP { get; set; }
    public int RequiredXP { get; set; }
    public int StreakCount { get; set; }
    public string RankTier { get; set; } = string.Empty;
    public string StreakFlameColor { get; set; } = string.Empty;
    public DateTime? LastActiveDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CompletedQuestCount { get; set; }
    public int UnlockedBadgeCount { get; set; }
}

public class BadgeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public string RequiredType { get; set; } = string.Empty;
    public int RequiredValue { get; set; }
    public bool IsUnlocked { get; set; }
    public DateTime? UnlockedAt { get; set; }
}
