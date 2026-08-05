using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IGamificationService _gamificationService;

    public UsersController(AppDbContext context, IGamificationService gamificationService)
    {
        _context = context;
        _gamificationService = gamificationService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userId = GetUserId();
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound(new { message = "User not found." });

        var completedQuestCount = await _context.Quests
            .CountAsync(q => q.UserId == userId && q.IsCompleted);

        var unlockedBadgeCount = await _context.UserBadges
            .CountAsync(ub => ub.UserId == userId);

        var profile = new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Level = user.Level,
            CurrentXP = user.CurrentXP,
            RequiredXP = user.RequiredXP,
            StreakCount = user.StreakCount,
            RankTier = user.RankTier,
            StreakFlameColor = user.StreakFlameColor,
            LastActiveDate = user.LastActiveDate,
            CreatedAt = user.CreatedAt,
            CompletedQuestCount = completedQuestCount,
            UnlockedBadgeCount = unlockedBadgeCount
        };

        return Ok(profile);
    }

    [HttpGet("me/badges")]
    public async Task<ActionResult<List<BadgeDto>>> GetBadges()
    {
        var userId = GetUserId();
        var badges = await _gamificationService.GetUserBadgesAsync(userId);
        return Ok(badges);
    }
}
