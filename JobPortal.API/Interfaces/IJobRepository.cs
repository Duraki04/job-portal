using JobPortal.API.Entities;

namespace JobPortal.API.Interfaces
{
    public interface IJobRepository
    {
        Task<IEnumerable<Job>> GetJobsAsync(string? city, string? type, string? keyword);
        Task<Job?> GetByIdAsync(int id);
        Task AddAsync(Job job);
        Task UpdateAsync(Job job);
        Task DeleteAsync(int id);
    }
}