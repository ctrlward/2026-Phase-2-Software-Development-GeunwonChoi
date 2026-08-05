using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuestsController : ControllerBase
{
    private readonly IQuestService _questService;

    public QuestsController(IQuestService questService)
    {
        _questService = questService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestResponseDto>>> GetQuests()
    {
        var userId = GetUserId();
        var quests = await _questService.GetQuestsAsync(userId);
        return Ok(quests);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QuestResponseDto>> GetQuest(Guid id)
    {
        var userId = GetUserId();
        var quest = await _questService.GetQuestByIdAsync(userId, id);
        if (quest == null) return NotFound(new { message = "Quest not found." });
        return Ok(quest);
    }

    [HttpPost]
    public async Task<ActionResult<QuestResponseDto>> CreateQuest([FromBody] CreateQuestDto dto)
    {
        var userId = GetUserId();
        var quest = await _questService.CreateQuestAsync(userId, dto);
        return CreatedAtAction(nameof(GetQuest), new { id = quest.Id }, quest);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<QuestResponseDto>> UpdateQuest(Guid id, [FromBody] UpdateQuestDto dto)
    {
        var userId = GetUserId();
        var quest = await _questService.UpdateQuestAsync(userId, id, dto);
        if (quest == null) return NotFound(new { message = "Quest not found." });
        return Ok(quest);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteQuest(Guid id)
    {
        var userId = GetUserId();
        var success = await _questService.DeleteQuestAsync(userId, id);
        if (!success) return NotFound(new { message = "Quest not found." });
        return NoContent();
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<ActionResult<QuestCompletionResponseDto>> CompleteQuest(Guid id)
    {
        var userId = GetUserId();
        try
        {
            var result = await _questService.CompleteQuestAsync(userId, id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
