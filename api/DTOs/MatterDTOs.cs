using System.ComponentModel.DataAnnotations;

namespace LegalSaasApi.DTOs
{
    public class CreateMatterDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? CaseType { get; set; }

        public string Status { get; set; } = "Active";

        public DateTime? StartDate { get; set; }
    }

    public class UpdateMatterDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? CaseType { get; set; }

        public string Status { get; set; } = "Active";

        public DateTime? StartDate { get; set; }
    }

    public class MatterDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? CaseType { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? CustomerName { get; set; }
    }
}