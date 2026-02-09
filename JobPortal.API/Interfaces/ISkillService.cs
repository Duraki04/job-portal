using JobPortal.API.Entities;

namespace JobPortal.API.Interfaces
{
    public interface ISkillService
    {
        Task<List<Skill>> GetAllAsync();
        Task<Skill> CreateAsync(string name);
        Task DeleteAsync(int id);
    }
}
