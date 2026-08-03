namespace Backend.Models;

/// <summary>
/// Represents a quest/task entity created by a user with difficulty and XP reward settings.
/// </summary>
public class Quest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int XPReward { get; set; } = 50;
    public string Difficulty { get; set; } = "Easy"; // "Easy", "Medium", "Hard"
    public bool IsCompleted { get; set; } = false;
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User? User { get; set; }
}
