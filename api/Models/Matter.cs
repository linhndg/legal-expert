using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LegalSaasApi.Models
{
    [Table("matters")]
    public class Matter
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("customer_id")]
        public Guid CustomerId { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(300)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("case_type")]
        [MaxLength(100)]
        public string? CaseType { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; } = null!;
    }
}