using JobPortal.API.Data;
using JobPortal.API.Entities;
using JobPortal.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly AppDbContext _context;
        public JobRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Job>> GetJobsAsync(string? city, string? type, string? keyword)
        {
            var query = _context.Jobs
                .Include(j => j.Company)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(city))
            {
                var c = city.Trim();
                query = query.Where(j => j.City == c);
            }

            if (!string.IsNullOrWhiteSpace(type))
            {
                var t = type.Trim();
                query = query.Where(j => j.EmploymentType == t);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var k = keyword.Trim();
                query = query.Where(j => j.Title.Contains(k));
            }

            return await query
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();
        }

        public async Task<Job?> GetByIdAsync(int id) =>
            await _context.Jobs
                .Include(j => j.Company)
                .FirstOrDefaultAsync(j => j.Id == id);

        public async Task AddAsync(Job job)
        {
            await _context.Jobs.AddAsync(job);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Job job)
        {
            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return;

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync(); // mund të hedh DbUpdateException (Restrict)
        }
    }
}
