using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using LegalSaasApi.Services.Interfaces;
using LegalSaasApi.DTOs;

namespace LegalSaasApi.Controllers
{
    [ApiController]
    [Route("api/customer")]
    public class CustomerPortalController : ControllerBase
    {
        private readonly ICustomerAuthService _customerAuthService;

        public CustomerPortalController(ICustomerAuthService customerAuthService)
        {
            _customerAuthService = customerAuthService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _customerAuthService.LoginAsync(loginDto);
            
            if (result == null)
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            return Ok(result);
        }

        // Temporary diagnostic endpoint
        [HttpGet("debug/customers")]
        public async Task<IActionResult> GetDebugCustomers()
        {
            var customers = await _customerAuthService.GetAllPortalCustomersAsync();
            return Ok(customers);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var customerIdClaim = User.FindFirst("customer_id")?.Value;
            var userTypeClaim = User.FindFirst("user_type")?.Value;

            if (string.IsNullOrEmpty(customerIdClaim) || userTypeClaim != "customer")
            {
                return Unauthorized(new { message = "Invalid customer token" });
            }

            if (!Guid.TryParse(customerIdClaim, out var customerId))
            {
                return BadRequest(new { message = "Invalid customer ID" });
            }

            var customer = await _customerAuthService.GetCustomerProfileAsync(customerId);
            
            if (customer == null)
            {
                return NotFound(new { message = "Customer not found" });
            }

            return Ok(customer);
        }

        [HttpGet("matters")]
        [Authorize]
        public async Task<IActionResult> GetMatters()
        {
            var customerIdClaim = User.FindFirst("customer_id")?.Value;
            var userTypeClaim = User.FindFirst("user_type")?.Value;

            if (string.IsNullOrEmpty(customerIdClaim) || userTypeClaim != "customer")
            {
                return Unauthorized(new { message = "Invalid customer token" });
            }

            if (!Guid.TryParse(customerIdClaim, out var customerId))
            {
                return BadRequest(new { message = "Invalid customer ID" });
            }

            var matters = await _customerAuthService.GetCustomerMattersAsync(customerId);
            
            return Ok(matters);
        }
    }
}
