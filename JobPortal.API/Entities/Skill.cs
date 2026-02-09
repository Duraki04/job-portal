using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.Entities
{
    public class Skill
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(80)]
        public string Name { get; set; } = string.Empty;

        public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    }
}
