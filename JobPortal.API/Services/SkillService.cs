using JobPortal.API.Data;
using JobPortal.API.Entities;
using JobPortal.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services
{
    public class SkillService : ISkillService
    {
        private readonly AppDbContext _context;

        public SkillService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Skill>> GetAllAsync()
        {
            return await _context.Skills
                .AsNoTracking()
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<Skill> CreateAsync(string name)
        {
            name = (name ?? "").Trim();
            if (string.IsNullOrWhiteSpace(name))
                throw new Exception("Skill name is required.");

            var exists = await _context.Skills
                .AnyAsync(s => s.Name.ToLower() == name.ToLower());

            if (exists)
                throw new Exception("Skill already exists.");

            var skill = new Skill { Name = name };
            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();

            return skill;
        }

        public async Task DeleteAsync(int id)
        {
            var skill = await _context.Skills.FirstOrDefaultAsync(s => s.Id == id);
            if (skill == null) return;

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();
        }
    }
}
