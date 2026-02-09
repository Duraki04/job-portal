using JobPortal.API.Common;
using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Entities;
using JobPortal.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services
{
    public class JobService : IJobService
    {
        private readonly AppDbContext _context;

        public JobService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<JobListItemDto>> GetJobsAsync(JobQueryDto query)
        {
            var jobsQuery = _context.Jobs
                .AsNoTracking()
                .Include(j => j.Company)
                .Where(j => !j.ExpiresAt.HasValue || j.ExpiresAt > DateTime.UtcNow)
                .AsQueryable();

            // Filtering
            if (!string.IsNullOrWhiteSpace(query.City))
                jobsQuery = jobsQuery.Where(j => j.City == query.City);

            if (!string.IsNullOrWhiteSpace(query.Type))
                jobsQuery = jobsQuery.Where(j => j.EmploymentType == query.Type);

            if (!string.IsNullOrWhiteSpace(query.Keyword))
                jobsQuery = jobsQuery.Where(j => j.Title.Contains(query.Keyword));

            if (query.Remote.HasValue)
                jobsQuery = jobsQuery.Where(j => j.IsRemote == query.Remote.Value);

            // Sorting
            jobsQuery = query.SortBy.ToLower() switch
            {
                "salarymin" => query.SortDir == "asc"
                    ? jobsQuery.OrderBy(j => j.SalaryMin)
                    : jobsQuery.OrderByDescending(j => j.SalaryMin),

                "title" => query.SortDir == "asc"
                    ? jobsQuery.OrderBy(j => j.Title)
                    : jobsQuery.OrderByDescending(j => j.Title),

                _ => query.SortDir == "asc"
                    ? jobsQuery.OrderBy(j => j.CreatedAt)
                    : jobsQuery.OrderByDescending(j => j.CreatedAt)
            };

            var totalItems = await jobsQuery.CountAsync();

            var jobs = await jobsQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(j => new JobListItemDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    City = j.City,
                    IsRemote = j.IsRemote,
                    EmploymentType = j.EmploymentType,
                    SalaryMin = j.SalaryMin,
                    SalaryMax = j.SalaryMax,
                    CreatedAt = j.CreatedAt,
                    ExpiresAt = j.ExpiresAt,
                    CompanyId = j.CompanyId,
                    CompanyName = j.Company.Name
                })
                .ToListAsync();

            return PagedResult<JobListItemDto>.Create(
                jobs,
                totalItems,
                query.Page,
                query.PageSize
            );
        }

        public async Task<JobDetailsDto?> GetByIdAsync(int id)
        {
            var job = await _context.Jobs
                .AsNoTracking()
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null) return null;

            return new JobDetailsDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                City = job.City,
                IsRemote = job.IsRemote,
                EmploymentType = job.EmploymentType,
                SalaryMin = job.SalaryMin,
                SalaryMax = job.SalaryMax,
                CreatedAt = job.CreatedAt,
                ExpiresAt = job.ExpiresAt,
                CompanyId = job.CompanyId,
                CompanyName = job.Company.Name,
                CompanyWebsite = job.Company.Website,
                CompanyCity = job.Company.City,
                CompanyDescription = job.Company.Description
            };
        }

        public async Task<int> CreateJobAsync(int userId, CreateJobDto dto)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Only employers can create jobs.");

            if (dto.SalaryMax > 0 && dto.SalaryMin > dto.SalaryMax)
                throw new Exception("SalaryMin cannot be greater than SalaryMax.");

            var job = new Job
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                City = dto.City.Trim(),
                IsRemote = dto.IsRemote,
                EmploymentType = dto.EmploymentType.Trim(),
                SalaryMin = dto.SalaryMin,
                SalaryMax = dto.SalaryMax,
                CompanyId = company.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = dto.ExpiresAt ?? DateTime.UtcNow.AddDays(30)
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return job.Id;
        }

        public async Task<bool> DeleteJobAsync(int userId, int jobId)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == jobId);

            if (job == null)
                return false;

            // Ownership check
            if (job.Company.UserId != userId)
                throw new UnauthorizedAccessException("You cannot delete this job.");

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
