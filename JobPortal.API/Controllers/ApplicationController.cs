using JobPortal.API.DTOs;
using JobPortal.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _service;

        public ApplicationController(IApplicationService service)
        {
            _service = service;
        }

        // Candidate: Apply
        // POST /api/application/apply/{jobId}
        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Apply(int jobId, [FromBody] ApplyJobDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();

            var userId = int.Parse(userIdClaim);

            await _service.ApplyAsync(userId, jobId, dto);

            return Ok(new { message = "Application submitted successfully!" });
        }

        // Candidate: My Applications (paged)
        // GET /api/application/my-applications?page=1&pageSize=10
        [HttpGet("my-applications")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> GetMyApplications([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();

            var userId = int.Parse(userIdClaim);

            var result = await _service.GetMyApplicationsAsync(userId, page, pageSize);
            return Ok(result);
        }

        // Employer/Admin: Applications for a Job (paged)
        // GET /api/application/job/{jobId}?page=1&pageSize=10
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();

            var userId = int.Parse(userIdClaim);

            var result = await _service.GetApplicationsForJobAsync(userId, jobId, page, pageSize);
            return Ok(result);
        }

        // Employer/Admin: Update Application Status
        // PATCH /api/application/{applicationId}/status
        [HttpPatch("{applicationId}/status")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> UpdateStatus(int applicationId, [FromBody] UpdateApplicationStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim)) return Unauthorized();

            var userId = int.Parse(userIdClaim);

            await _service.UpdateApplicationStatusAsync(userId, applicationId, dto);
            return Ok(new { message = "Application status updated." });
        }
    }
}
