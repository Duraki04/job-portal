using JobPortal.API.Common;
using JobPortal.API.DTOs;

namespace JobPortal.API.Interfaces
{
    public interface IApplicationService
    {
        // Candidate
        Task ApplyAsync(int userId, int jobId, ApplyJobDto dto);
        Task<PagedResult<MyApplicationDto>> GetMyApplicationsAsync(int userId, int page, int pageSize);

        // Employer
        Task<PagedResult<JobApplicationDto>> GetApplicationsForJobAsync(int userId, int jobId, int page, int pageSize);
        Task UpdateApplicationStatusAsync(int userId, int applicationId, UpdateApplicationStatusDto dto);
    }
}
