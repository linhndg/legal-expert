using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using LegalSaasApi.Services.Interfaces;
using LegalSaasApi.DTOs;

namespace LegalSaasApi.Controllers
{
    [ApiController]
    [Route("api/customers/{customerId}/[controller]")]
    [Authorize]
    public class MattersController : ControllerBase
    {
        private readonly IMatterService _matterService;

        public MattersController(IMatterService matterService)
        {
            _matterService = matterService;
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }

        [HttpGet]
        public async Task<IActionResult> GetMatters(Guid customerId)
        {
            var userId = GetCurrentUserId();
            var matters = await _matterService.GetMattersAsync(customerId, userId);
            return Ok(matters);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatter(Guid customerId, Guid id)
        {
            var userId = GetCurrentUserId();
            var matter = await _matterService.GetMatterByIdAsync(customerId, id, userId);
            
            if (matter == null)
            {
                return NotFound(new { message = "Matter not found" });
            }

            return Ok(matter);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMatter(Guid customerId, [FromBody] CreateMatterDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var matter = await _matterService.CreateMatterAsync(customerId, createDto, userId);
            
            if (matter == null)
            {
                return NotFound(new { message = "Customer not found" });
            }

            return CreatedAtAction(nameof(GetMatter), new { customerId, id = matter.Id }, matter);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMatter(Guid customerId, Guid id, [FromBody] UpdateMatterDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var matter = await _matterService.UpdateMatterAsync(customerId, id, updateDto, userId);
            
            if (matter == null)
            {
                return NotFound(new { message = "Matter not found" });
            }

            return Ok(matter);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatter(Guid customerId, Guid id)
        {
            var userId = GetCurrentUserId();
            var success = await _matterService.DeleteMatterAsync(customerId, id, userId);
            
            if (!success)
            {
                return NotFound(new { message = "Matter not found" });
            }

            return NoContent();
        }
    }
}