namespace JobPortal.API.Entities
{
    public enum UserRole
    {
        Admin,
        Employer,
        Candidate
    }

    public enum ApplicationStatus
    {
        Pending,
        Shortlisted,
        Accepted,
        Rejected
    }
}