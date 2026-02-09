using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly AppDbContext _context;

        public CandidateService(AppDbContext context)
        {
            _context = context;
        }

        // ================================
        // GET My Candidate Profile
        // ================================
        public async Task<CandidateProfileDto?> GetMyProfileAsync(int userId)
        {
            var candidate = await _context.Candidates
                .AsNoTracking()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (candidate == null)
                return null;

            return new CandidateProfileDto
            {
                Id = candidate.Id,
                City = candidate.City,
                Bio = candidate.Bio,
                ExperienceLevel = candidate.ExperienceLevel,
                CVUrl = candidate.CVUrl,
                Phone = candidate.Phone,
                UserId = candidate.UserId,
                FullName = candidate.User.FullName,
                Email = candidate.User.Email
            };
        }

        // ================================
        // UPDATE My Candidate Profile
        // ================================
        public async Task UpdateMyProfileAsync(int userId, UpdateCandidateProfileDto dto)
        {
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (candidate == null)
                throw new Exception("Candidate profile not found.");

            candidate.City = dto.City?.Trim() ?? "";
            candidate.Bio = string.IsNullOrWhiteSpace(dto.Bio) ? null : dto.Bio.Trim();
            candidate.ExperienceLevel = dto.ExperienceLevel?.Trim() ?? "";
            candidate.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim();
            candidate.CVUrl = string.IsNullOrWhiteSpace(dto.CVUrl) ? null : dto.CVUrl.Trim();

            await _context.SaveChangesAsync();
        }
    }
}
