using Backend.DTOs;

namespace Backend.Services;

public interface IQuestService
{
    Task<List<QuestResponseDto>> GetQuestsAsync(Guid userId);
    Task<QuestResponseDto?> GetQuestByIdAsync(Guid userId, Guid questId);
    Task<QuestResponseDto> CreateQuestAsync(Guid userId, CreateQuestDto dto);
    Task<QuestResponseDto?> UpdateQuestAsync(Guid userId, Guid questId, UpdateQuestDto dto);
    Task<bool> DeleteQuestAsync(Guid userId, Guid questId);
    Task<QuestCompletionResponseDto> CompleteQuestAsync(Guid userId, Guid questId);
}
