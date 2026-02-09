using JobPortal.API.DTOs;
using JobPortal.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public CompanyController(ICompanyService service)
        {
            _service = service;
        }

        // ======================================================
        // ✅ PUBLIC ENDPOINTS (for React: Companies + Details)
        // ======================================================

        // GET: /api/company
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _service.GetCompaniesPublicAsync();
            return Ok(companies);
        }

        // GET: /api/company/{id}
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompanyPublic(int id)
        {
            var company = await _service.GetCompanyPublicAsync(id);
            if (company == null)
                return NotFound("Company not found.");

            return Ok(company);
        }

        // ======================================================
        // ✅ EMPLOYER/ADMIN ENDPOINTS (My company profile)
        // ======================================================

        // GET: /api/company/me
        [HttpGet("me")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> GetMyCompany()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var company = await _service.GetMyCompanyAsync(userId);
            if (company == null)
                return NotFound("Company profile not found.");

            return Ok(company);
        }

        // PUT: /api/company/me
        [HttpPut("me")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> UpdateMyCompany([FromBody] UpdateCompanyProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.UpdateCompanyAsync(userId, dto);

            return Ok(new { message = "Company profile updated." });
        }
    }
}
