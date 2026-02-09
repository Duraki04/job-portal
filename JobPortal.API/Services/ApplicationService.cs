using JobPortal.API.Common;
using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Entities;
using JobPortal.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _context;

        public ApplicationService(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // Candidate: Apply
        // =========================
        public async Task ApplyAsync(int userId, int jobId, ApplyJobDto dto)
        {
            // Candidate + CV in one go
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (candidate == null)
                throw new InvalidOperationException("Only candidates can apply.");

            var job = await _context.Jobs
                .AsNoTracking()
                .FirstOrDefaultAsync(j => j.Id == jobId);

            if (job == null)
                throw new KeyNotFoundException("Job not found.");

            if (job.ExpiresAt.HasValue && job.ExpiresAt.Value < DateTime.UtcNow)
                throw new InvalidOperationException("This job is expired.");

            var alreadyApplied = await _context.Applications
                .AnyAsync(a => a.JobId == jobId && a.CandidateId == candidate.Id);

            if (alreadyApplied)
                throw new InvalidOperationException("You have already applied for this job.");

            var app = new Application
            {
                JobId = jobId,
                CandidateId = candidate.Id,
                AppliedAt = DateTime.UtcNow,
                Status = ApplicationStatus.Pending,
                CoverLetter = string.IsNullOrWhiteSpace(dto.CoverLetter) ? null : dto.CoverLetter.Trim(),
                CVUrlSnapshot = !string.IsNullOrWhiteSpace(dto.CVUrlSnapshot)
                    ? dto.CVUrlSnapshot.Trim()
                    : candidate.CVUrl
            };

            _context.Applications.Add(app);

            // NOTE: Nëse vendos Unique Index në DB,
            // mund të kapësh DbUpdateException për raste race-condition.
            await _context.SaveChangesAsync();
        }

        // =========================
        // Candidate: My applications (paged)
        // =========================
        public async Task<PagedResult<MyApplicationDto>> GetMyApplicationsAsync(int userId, int page, int pageSize)
        {
            var candidateId = await _context.Candidates
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .Select(c => (int?)c.Id)
                .FirstOrDefaultAsync();

            if (candidateId == null)
                throw new InvalidOperationException("Candidate profile not found.");

            var query = _context.Applications
                .AsNoTracking()
                .Where(a => a.CandidateId == candidateId.Value)
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .OrderByDescending(a => a.AppliedAt);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new MyApplicationDto
                {
                    ApplicationId = a.Id,
                    AppliedAt = a.AppliedAt,
                    Status = a.Status.ToString(),

                    JobId = a.JobId,
                    JobTitle = a.Job.Title,
                    JobCity = a.Job.City,
                    IsRemote = a.Job.IsRemote,

                    CompanyId = a.Job.CompanyId,
                    CompanyName = a.Job.Company.Name
                })
                .ToListAsync();

            return PagedResult<MyApplicationDto>.Create(items, total, page, pageSize);
        }

        // =========================
        // Employer/Admin: applications for a job (ownership + paged)
        // =========================
        public async Task<PagedResult<JobApplicationDto>> GetApplicationsForJobAsync(int userId, int jobId, int page, int pageSize)
        {
            // ✅ Admin bypass: Admin mund të shohë çdo job
            var isAdmin = await _context.Users
                .AsNoTracking()
                .AnyAsync(u => u.Id == userId && u.Role == UserRole.Admin);

            if (!isAdmin)
            {
                var jobOwned = await _context.Jobs
                    .AsNoTracking()
                    .Include(j => j.Company)
                    .AnyAsync(j => j.Id == jobId && j.Company.UserId == userId);

                if (!jobOwned)
                    throw new UnauthorizedAccessException("You do not own this job.");
            }

            var query = _context.Applications
                .AsNoTracking()
                .Where(a => a.JobId == jobId)
                .Include(a => a.Candidate)
                    .ThenInclude(c => c.User)
                .OrderByDescending(a => a.AppliedAt);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new JobApplicationDto
                {
                    ApplicationId = a.Id,
                    AppliedAt = a.AppliedAt,
                    Status = a.Status.ToString(),

                    CandidateId = a.CandidateId,
                    CandidateFullName = a.Candidate.User.FullName,
                    CandidateCity = a.Candidate.City,
                    ExperienceLevel = a.Candidate.ExperienceLevel,
                    CVUrl = a.CVUrlSnapshot ?? a.Candidate.CVUrl,

                    CoverLetter = a.CoverLetter
                })
                .ToListAsync();

            return PagedResult<JobApplicationDto>.Create(items, total, page, pageSize);
        }

        // =========================
        // Employer/Admin: update application status (ownership)
        // =========================
        public async Task UpdateApplicationStatusAsync(int userId, int applicationId, UpdateApplicationStatusDto dto)
        {
            if (!Enum.TryParse<ApplicationStatus>(dto.Status, ignoreCase: true, out var newStatus))
                throw new InvalidOperationException("Invalid status. Allowed: Pending, Shortlisted, Accepted, Rejected.");

            var application = await _context.Applications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
                throw new KeyNotFoundException("Application not found.");

            // ✅ Admin bypass
            var isAdmin = await _context.Users
                .AsNoTracking()
                .AnyAsync(u => u.Id == userId && u.Role == UserRole.Admin);

            if (!isAdmin)
            {
                if (application.Job.Company.UserId != userId)
                    throw new UnauthorizedAccessException("You cannot update this application.");
            }

            application.Status = newStatus;
            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}
