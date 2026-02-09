using JobPortal.API.Entities;
using JobPortal.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkillController : ControllerBase
    {
        private readonly ISkillService _service;

        public SkillController(ISkillService service)
        {
            _service = service;
        }

        // GET /api/skill
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<Skill>>> GetAll()
        {
            var skills = await _service.GetAllAsync();
            return Ok(skills);
        }

        // POST /api/skill
        // Body: { "name": "React" }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Skill>> Create([FromBody] CreateSkillRequest req)
        {
            var created = await _service.CreateAsync(req.Name);
            return Ok(created);
        }

        // DELETE /api/skill/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        public class CreateSkillRequest
        {
            public string Name { get; set; } = "";
        }
    }
}
