namespace Backend.Models;

/// <summary>
/// Represents a user entity with authentication, authorization, and gamification properties.
/// </summary>
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // "User" or "Admin" for RBAC

    // Gamification properties
    public int Level { get; set; } = 1;
    public int CurrentXP { get; set; } = 0;
    public int RequiredXP { get; set; } = 100;
    public int StreakCount { get; set; } = 0;
    public DateTime? LastActiveDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Computes Hunter Rank Tier inspired by Solo Leveling.
    /// Level 100+: National-Level
    /// Level 50-99: S-Rank
    /// Level 40-49: A-Rank
    /// Level 30-39: B-Rank
    /// Level 20-29: C-Rank
    /// Level 10-19: D-Rank
    /// Level 1-9: E-Rank
    /// </summary>
    public string RankTier => Level switch
    {
        >= 100 => "National-Level",
        >= 50 => "S-Rank",
        >= 40 => "A-Rank",
        >= 30 => "B-Rank",
        >= 20 => "C-Rank",
        >= 10 => "D-Rank",
        _ => "E-Rank"
    };

    /// <summary>
    /// Computes Streak Flame Color based on active streak duration.
    /// 365+ days: White Flame
    /// 90+ days: Purple Flame
    /// 30+ days: Blue Flame
    /// 7+ days: Red Flame
    /// Less than 7 days: None
    /// </summary>
    public string StreakFlameColor => StreakCount switch
    {
        >= 365 => "White",
        >= 90 => "Purple",
        >= 30 => "Blue",
        >= 7 => "Red",
        _ => "None"
    };

    // Navigation properties for EF Core
    public ICollection<Quest> Quests { get; set; } = new List<Quest>();
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}
