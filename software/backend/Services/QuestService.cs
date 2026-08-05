using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class QuestService : IQuestService
{
    private readonly AppDbContext _context;
    private readonly IGamificationService _gamificationService;

    public QuestService(AppDbContext context, IGamificationService gamificationService)
    {
        _context = context;
        _gamificationService = gamificationService;
    }

    public async Task<List<QuestResponseDto>> GetQuestsAsync(Guid userId)
    {
        var quests = await _context.Quests
            .Where(q => q.UserId == userId)
            .OrderByDescending(q => q.CreatedAt)
            .ToListAsync();

        return quests.Select(MapToDto).ToList();
    }

    public async Task<QuestResponseDto?> GetQuestByIdAsync(Guid userId, Guid questId)
    {
        var quest = await _context.Quests
            .FirstOrDefaultAsync(q => q.Id == questId && q.UserId == userId);

        return quest == null ? null : MapToDto(quest);
    }

    public async Task<QuestResponseDto> CreateQuestAsync(Guid userId, CreateQuestDto dto)
    {
        var quest = new Quest
        {
            UserId = userId,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            XPReward = dto.XPReward,
            Difficulty = dto.Difficulty,
            DueDate = dto.DueDate,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Quests.Add(quest);
        await _context.SaveChangesAsync();

        return MapToDto(quest);
    }

    public async Task<QuestResponseDto?> UpdateQuestAsync(Guid userId, Guid questId, UpdateQuestDto dto)
    {
        var quest = await _context.Quests
            .FirstOrDefaultAsync(q => q.Id == questId && q.UserId == userId);

        if (quest == null) return null;

        quest.Title = dto.Title.Trim();
        quest.Description = dto.Description?.Trim();
        quest.XPReward = dto.XPReward;
        quest.Difficulty = dto.Difficulty;
        quest.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();

        return MapToDto(quest);
    }

    public async Task<bool> DeleteQuestAsync(Guid userId, Guid questId)
    {
        var quest = await _context.Quests
            .FirstOrDefaultAsync(q => q.Id == questId && q.UserId == userId);

        if (quest == null) return false;

        _context.Quests.Remove(quest);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<QuestCompletionResponseDto> CompleteQuestAsync(Guid userId, Guid questId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new KeyNotFoundException("User not found.");

        var quest = await _context.Quests
            .FirstOrDefaultAsync(q => q.Id == questId && q.UserId == userId);

        if (quest == null) throw new KeyNotFoundException("Quest not found.");

        if (quest.IsCompleted)
        {
            throw new InvalidOperationException("Quest is already completed.");
        }

        return await _gamificationService.ProcessQuestCompletionAsync(user, quest);
    }

    private static QuestResponseDto MapToDto(Quest quest)
    {
        return new QuestResponseDto
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
    }
}
