using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// <summary>
/// Admin controller providing user management endpoints restricted to Administrator role.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    /// <summary>
    /// Retrieves all registered users in the system with profile statistics.
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<List<UserProfileDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        var userProfiles = new List<UserProfileDto>();

        foreach (var user in users)
        {
            var completedQuestCount = await _context.Quests
                .CountAsync(q => q.UserId == user.Id && q.IsCompleted);

            var unlockedBadgeCount = await _context.UserBadges
                .CountAsync(ub => ub.UserId == user.Id);

            userProfiles.Add(new UserProfileDto
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
            });
        }

        return Ok(userProfiles);
    }

    /// <summary>
    /// Purges/Deletes a specified user account and associated data from the system.
    /// </summary>
    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var currentAdminId = GetUserId();
        if (id == currentAdminId)
        {
            return BadRequest(new { message = "Cannot delete your own active admin account." });
        }

        var user = await _context.Users
            .Include(u => u.Quests)
            .Include(u => u.UserBadges)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { message = "User account not found." });
        }

        _context.Quests.RemoveRange(user.Quests);
        _context.UserBadges.RemoveRange(user.UserBadges);
        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new { message = $"User account '{user.Username}' has been successfully purged from the system." });
    }
}
