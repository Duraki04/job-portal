using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Entities;
using JobPortal.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Candidate")]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateService _service;
        private readonly AppDbContext _db;

        public CandidateController(ICandidateService service, AppDbContext db)
        {
            _service = service;
            _db = db;
        }

        // GET: /api/candidate/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var profile = await _service.GetMyProfileAsync(userId);
            if (profile == null)
                return NotFound("Candidate profile not found.");

            return Ok(profile);
        }

        // PUT: /api/candidate/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateCandidateProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            await _service.UpdateMyProfileAsync(userId, dto);

            return Ok(new { message = "Candidate profile updated." });
        }

        // ===============================
        // ✅ Skills endpoints (for React)
        // ===============================

        // GET: /api/candidate/me/skills
        [HttpGet("me/skills")]
        public async Task<IActionResult> GetMySkills()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var candidateId = await _db.Candidates
                .Where(c => c.UserId == userId)
                .Select(c => c.Id)
                .FirstOrDefaultAsync();

            if (candidateId == 0)
                return NotFound("Candidate profile not found.");

            var skills = await _db.CandidateSkills
                .Where(cs => cs.CandidateId == candidateId)
                .Select(cs => new { id = cs.Skill.Id, name = cs.Skill.Name })
                .OrderBy(x => x.name)
                .ToListAsync();

            return Ok(skills);
        }

        public class UpdateMySkillsRequest
        {
            public List<int> SkillIds { get; set; } = new();
        }

        // PUT: /api/candidate/me/skills
        // Body: { "skillIds": [1,2,3] }
        [HttpPut("me/skills")]
        public async Task<IActionResult> UpdateMySkills([FromBody] UpdateMySkillsRequest req)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var candidateId = await _db.Candidates
                .Where(c => c.UserId == userId)
                .Select(c => c.Id)
                .FirstOrDefaultAsync();

            if (candidateId == 0)
                return NotFound("Candidate profile not found.");

            var incoming = (req.SkillIds ?? new List<int>())
                .Distinct()
                .ToList();

            // Vetëm skill IDs që ekzistojnë në DB
            var validSkillIds = await _db.Skills
                .Where(s => incoming.Contains(s.Id))
                .Select(s => s.Id)
                .ToListAsync();

            // Fshi lidhjet e vjetra
            var existing = await _db.CandidateSkills
                .Where(cs => cs.CandidateId == candidateId)
                .ToListAsync();

            _db.CandidateSkills.RemoveRange(existing);

            // Shto lidhjet e reja
            foreach (var sid in validSkillIds)
            {
                _db.CandidateSkills.Add(new CandidateSkill
                {
                    CandidateId = candidateId,
                    SkillId = sid
                });
            }

            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}

