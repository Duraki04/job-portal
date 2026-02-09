using JobPortal.API.DTOs;

namespace JobPortal.API.Interfaces
{
    public interface ICompanyService
    {
        // Employer/Admin
        Task<CompanyProfileDto?> GetMyCompanyAsync(int userId);
        Task UpdateCompanyAsync(int userId, UpdateCompanyProfileDto dto);

        // Public
        Task<List<CompanyListItemDto>> GetCompaniesPublicAsync();
        Task<CompanyPublicDetailsDto?> GetCompanyPublicAsync(int companyId);
    }
}
