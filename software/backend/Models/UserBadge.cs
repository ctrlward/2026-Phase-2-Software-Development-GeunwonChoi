namespace Backend.Models;

/// <summary>
/// Represents a mapping entity tracking which user unlocked which badge and when.
/// </summary>
public class UserBadge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid BadgeId { get; set; }
    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties for EF Core
    public User? User { get; set; }
    public Badge? Badge { get; set; }
}
