using JobPortal.API.Common;
using JobPortal.API.DTOs;

namespace JobPortal.API.Interfaces
{
    public interface IJobService
    {
        Task<PagedResult<JobListItemDto>> GetJobsAsync(JobQueryDto query);
        Task<JobDetailsDto?> GetByIdAsync(int id);

        Task<int> CreateJobAsync(int userId, CreateJobDto dto); // kthen JobId
        Task<bool> DeleteJobAsync(int userId, int jobId);       // true nëse u fshi
    }
}
