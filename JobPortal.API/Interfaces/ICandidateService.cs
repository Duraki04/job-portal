using JobPortal.API.DTOs;

namespace JobPortal.API.Interfaces
{
    public interface ICandidateService
    {
        Task<CandidateProfileDto?> GetMyProfileAsync(int userId);
        Task UpdateMyProfileAsync(int userId, UpdateCandidateProfileDto dto);
    }
}
