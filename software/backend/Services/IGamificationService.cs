using Backend.DTOs;
using Backend.Models;

namespace Backend.Services;

public interface IGamificationService
{
    Task<QuestCompletionResponseDto> ProcessQuestCompletionAsync(User user, Quest quest);
    Task<List<BadgeDto>> GetUserBadgesAsync(Guid userId);
}
