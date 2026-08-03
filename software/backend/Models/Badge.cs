namespace Backend.Models;

/// <summary>
/// Represents a master badge entity defining unlock criteria and visual asset path.
/// </summary>
public class Badge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public string RequiredType { get; set; } = string.Empty; // "QuestCount", "Level", "Streak"
    public int RequiredValue { get; set; }

    // Navigation property for EF Core
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}
