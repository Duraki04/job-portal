using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly AppDbContext _context;

        public CompanyService(AppDbContext context)
        {
            _context = context;
        }

        // ======================================================
        // ✅ PUBLIC: Companies list (for React /companies)
        // ======================================================
        public async Task<List<CompanyListItemDto>> GetCompaniesPublicAsync()
        {
            return await _context.Companies
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .Select(c => new CompanyListItemDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    City = c.City,
                    Industry = c.Industry
                })
                .ToListAsync();
        }

        // ======================================================
        // ✅ PUBLIC: Company details + jobs (for React /companies/:id)
        // ======================================================
        public async Task<CompanyPublicDetailsDto?> GetCompanyPublicAsync(int companyId)
        {
            return await _context.Companies
                .AsNoTracking()
                .Where(c => c.Id == companyId)
                .Select(c => new CompanyPublicDetailsDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    City = c.City,
                    Industry = c.Industry,
                    Description = c.Description,

                    Jobs = c.Jobs
                        .OrderByDescending(j => j.CreatedAt)
                        .Select(j => new CompanyJobItemDto
                        {
                            Id = j.Id,
                            Title = j.Title,
                            City = j.City,
                            IsRemote = j.IsRemote
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();
        }

        // ======================================================
        // ✅ EMPLOYER/ADMIN: My company profile (/api/company/me)
        // ======================================================
        public async Task<CompanyProfileDto?> GetMyCompanyAsync(int userId)
        {
            var company = await _context.Companies
                .AsNoTracking()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return null;

            return new CompanyProfileDto
            {
                Id = company.Id,
                Name = company.Name,
                Industry = company.Industry,
                City = company.City,
                Website = company.Website,
                Description = company.Description,
                UserId = company.UserId,
                OwnerFullName = company.User.FullName,
                OwnerEmail = company.User.Email
            };
        }

        // ======================================================
        // ✅ EMPLOYER/ADMIN: Update company profile (/api/company/me)
        // ======================================================
        public async Task UpdateCompanyAsync(int userId, UpdateCompanyProfileDto dto)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Company profile not found.");

            company.Name = dto.Name.Trim();
            company.Industry = dto.Industry?.Trim() ?? "";
            company.City = dto.City?.Trim() ?? "";
            company.Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website.Trim();
            company.Description = dto.Description?.Trim() ?? "";

            await _context.SaveChangesAsync();
        }
    }
}
