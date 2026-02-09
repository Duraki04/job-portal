using JobPortal.API.DTOs;
using JobPortal.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobController(IJobService jobService)
        {
            _jobService = jobService;
        }

        // GET: /api/job?city=&type=&keyword=&remote=&page=1&pageSize=10&sortBy=createdAt&sortDir=desc
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] JobQueryDto query)
        {
            if (query.Page <= 0) query.Page = 1;
            if (query.PageSize <= 0) query.PageSize = 10;
            if (query.PageSize > 50) query.PageSize = 50;

            var result = await _jobService.GetJobsAsync(query);
            return Ok(result);
        }

        // GET: /api/job/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var job = await _jobService.GetByIdAsync(id);
            return job == null ? NotFound("Job not found.") : Ok(job);
        }

        // POST: /api/job
        [HttpPost]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateJobDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            // NOTE: Admin s’ka kompani, nëse do Admin me kriju job pa kompani, duhet logjikë tjetër.
            var jobId = await _jobService.CreateJobAsync(userId, dto);

            return Ok(new { message = "Job created successfully", jobId });
        }

        // DELETE: /api/job/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var deleted = await _jobService.DeleteJobAsync(userId, id);
                if (!deleted) return NotFound("Job not found.");

                return Ok(new { message = "Job deleted" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Cannot delete this job because it has applications.");
            }
        }
    }
}
