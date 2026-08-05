using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class CreateQuestDto
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(10, 1000)]
    public int XPReward { get; set; } = 50;

    [Required]
    public string Difficulty { get; set; } = "Easy"; // Easy, Medium, Hard

    public DateTime? DueDate { get; set; }
}

public class UpdateQuestDto
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(10, 1000)]
    public int XPReward { get; set; } = 50;

    [Required]
    public string Difficulty { get; set; } = "Easy";

    public DateTime? DueDate { get; set; }
}

public class QuestResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int XPReward { get; set; }
    public string Difficulty { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class QuestCompletionResponseDto
{
    public QuestResponseDto Quest { get; set; } = null!;
    public int XPEarned { get; set; }
    public double StreakMultiplier { get; set; }
    public bool LeveledUp { get; set; }
    public int NewLevel { get; set; }
    public string RankTier { get; set; } = string.Empty;
    public int CurrentXP { get; set; }
    public int RequiredXP { get; set; }
    public int StreakCount { get; set; }
    public string StreakFlameColor { get; set; } = string.Empty;
    public List<BadgeDto> NewlyUnlockedBadges { get; set; } = new();
}
