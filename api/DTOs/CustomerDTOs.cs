using System.ComponentModel.DataAnnotations;

namespace LegalSaasApi.DTOs
{
    public class CreateCustomerDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        public string? Address { get; set; }

        public string? Notes { get; set; }

        [MinLength(6)]
        public string? Password { get; set; }

        public bool EnablePortalAccess { get; set; } = false;
    }

    public class UpdateCustomerDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        public string? Address { get; set; }

        public string? Notes { get; set; }

        [MinLength(6)]
        public string? Password { get; set; }

        public bool? EnablePortalAccess { get; set; }
    }

    public class CustomerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Notes { get; set; }
        public bool IsPortalEnabled { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int MattersCount { get; set; }
    }

    public class CustomerWithMattersDto : CustomerDto
    {
        public List<MatterDto> Matters { get; set; } = new List<MatterDto>();
    }
}