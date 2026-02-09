using Microsoft.EntityFrameworkCore;
using JobPortal.API.Entities;

namespace JobPortal.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Candidate> Candidates { get; set; } = null!;
        public DbSet<Job> Jobs { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<Skill> Skills { get; set; } = null!;
        public DbSet<CandidateSkill> CandidateSkills { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ===============================
            // UNIQUE: User Email
            // ===============================
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ===============================
            // Salary precision
            // ===============================
            modelBuilder.Entity<Job>()
                .Property(j => j.SalaryMin)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Job>()
                .Property(j => j.SalaryMax)
                .HasPrecision(18, 2);

            // ===============================
            // One-to-One: User -> Company
            // ===============================
            modelBuilder.Entity<User>()
                .HasOne(u => u.Company)
                .WithOne(c => c.User)
                .HasForeignKey<Company>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===============================
            // One-to-One: User -> Candidate
            // ===============================
            modelBuilder.Entity<User>()
                .HasOne(u => u.Candidate)
                .WithOne(c => c.User)
                .HasForeignKey<Candidate>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===============================
            // One-to-Many: Company -> Job
            // ===============================
            modelBuilder.Entity<Company>()
                .HasMany(c => c.Jobs)
                .WithOne(j => j.Company)
                .HasForeignKey(j => j.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===============================
            // Many-to-One: Application -> Job
            // ===============================
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            // ===============================
            // Many-to-One: Application -> Candidate
            // ===============================
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany(c => c.Applications)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===============================
            // 🔥 VERY IMPORTANT:
            // Prevent double apply (DB Level Protection)
            // ===============================
            modelBuilder.Entity<Application>()
                .HasIndex(a => new { a.JobId, a.CandidateId })
                .IsUnique();

            // Optional performance indexes
            modelBuilder.Entity<Application>()
                .HasIndex(a => a.JobId);

            modelBuilder.Entity<Application>()
                .HasIndex(a => a.CandidateId);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.CreatedAt);

            // ===============================
            // Many-to-Many: Candidate -> Skills
            // ===============================
            modelBuilder.Entity<CandidateSkill>()
                .HasKey(cs => new { cs.CandidateId, cs.SkillId });

            modelBuilder.Entity<CandidateSkill>()
                .HasOne(cs => cs.Candidate)
                .WithMany(c => c.CandidateSkills)
                .HasForeignKey(cs => cs.CandidateId);

            modelBuilder.Entity<CandidateSkill>()
                .HasOne(cs => cs.Skill)
                .WithMany(s => s.CandidateSkills)
                .HasForeignKey(cs => cs.SkillId);
        }
    }
}

