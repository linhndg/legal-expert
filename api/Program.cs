using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LegalSaasApi.Data;
using LegalSaasApi.Services;
using LegalSaasApi.Services.Interfaces;
using LegalSaasApi.Repositories;
using LegalSaasApi.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework with In-Memory Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("LegalSaasDb"));

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "your-super-secret-jwt-key-that-is-at-least-32-characters-long";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LegalSaasApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LegalSaasClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Production - allow all origins and methods
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IMatterRepository, MatterRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IMatterService, MatterService>();
builder.Services.AddScoped<ICustomerAuthService, CustomerAuthService>();

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    
    // Seed test law firm user
    var testUserId = Guid.NewGuid();
    if (!context.Users.Any(u => u.Email == "demo@legalflow.com"))
    {
        var testUser = new LegalSaasApi.Models.User
        {
            Id = testUserId,
            FirstName = "LegalFlow",
            LastName = "Demo",
            Email = "demo@legalflow.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("demo123"),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        context.Users.Add(testUser);
        context.SaveChanges();
    }
    else
    {
        // Get existing test user ID
        var existingUser = context.Users.First(u => u.Email == "demo@legalflow.com");
        testUserId = existingUser.Id;
    }
    
    // Seed test customer with portal access
    var johnCustomerId = Guid.NewGuid();
    if (!context.Customers.Any(c => c.Email == "john@test.com"))
    {
        var johnCustomer = new LegalSaasApi.Models.Customer
        {
            Id = johnCustomerId,
            UserId = testUserId,
            Name = "John Test Customer",
            Email = "john@test.com",
            PhoneNumber = "555-0123",
            Address = "123 Test Street, Demo City, DC 12345",
            Notes = "Demo customer account for testing the customer portal",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
            IsPortalEnabled = true,
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            UpdatedAt = DateTime.UtcNow.AddDays(-5)
        };
        
        context.Customers.Add(johnCustomer);
        context.SaveChanges();
    }
    else
    {
        var existingCustomer = context.Customers.First(c => c.Email == "john@test.com");
        johnCustomerId = existingCustomer.Id;
    }
    
    // Seed additional test customer without portal access
    if (!context.Customers.Any(c => c.Email == "sarah@company.com"))
    {
        var sarahCustomer = new LegalSaasApi.Models.Customer
        {
            Id = Guid.NewGuid(),
            UserId = testUserId,
            Name = "Sarah Business Owner",
            Email = "sarah@company.com",
            PhoneNumber = "555-0456",
            Address = "456 Business Ave, Demo City, DC 12345",
            Notes = "Corporate client for business law matters",
            IsPortalEnabled = false,
            CreatedAt = DateTime.UtcNow.AddDays(-45),
            UpdatedAt = DateTime.UtcNow.AddDays(-10)
        };
        
        context.Customers.Add(sarahCustomer);
        context.SaveChanges();
    }
    
    // Seed test matters for John
    if (!context.Matters.Any(m => m.CustomerId == johnCustomerId))
    {
        var matters = new[]
        {
            new LegalSaasApi.Models.Matter
            {
                Id = Guid.NewGuid(),
                CustomerId = johnCustomerId,
                Name = "Personal Injury Case",
                Description = "Car accident claim against insurance company. Client injured in rear-end collision on Highway 101.",
                CaseType = "Personal Injury",
                Status = "Active",
                StartDate = DateTime.UtcNow.AddDays(-25),
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new LegalSaasApi.Models.Matter
            {
                Id = Guid.NewGuid(),
                CustomerId = johnCustomerId,
                Name = "Property Dispute Resolution",
                Description = "Boundary dispute with neighbor regarding fence placement and property line encroachment.",
                CaseType = "Real Estate",
                Status = "Pending",
                StartDate = DateTime.UtcNow.AddDays(-15),
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new LegalSaasApi.Models.Matter
            {
                Id = Guid.NewGuid(),
                CustomerId = johnCustomerId,
                Name = "Employment Contract Review",
                Description = "Review and negotiation of new employment contract terms and non-compete clauses.",
                CaseType = "Employment",
                Status = "Closed",
                StartDate = DateTime.UtcNow.AddDays(-60),
                CreatedAt = DateTime.UtcNow.AddDays(-60),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            }
        };
        
        context.Matters.AddRange(matters);
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Enable Swagger in production for debugging
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LegalFlow API V1");
        c.RoutePrefix = "swagger";
    });
}

// Enable static files serving for React app
app.UseStaticFiles();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

// Map API controllers with explicit /api prefix
app.MapControllers();

// Add a simple health check endpoint
app.MapGet("/api/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

// Fallback to serve React app for SPA routing (only for non-API routes)
app.MapFallbackToFile("index.html").Add(endpointBuilder =>
{
    endpointBuilder.Metadata.Add(new HttpMethodMetadata(new[] { "GET" }));
});

app.Run();
