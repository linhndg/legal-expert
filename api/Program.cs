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
    
    // Seed hardcoded customer for testing
    if (!context.Customers.Any(c => c.Email == "john@test.com"))
    {
        var testCustomer = new LegalSaasApi.Models.Customer
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(), // Dummy user ID for testing
            Name = "John Test Customer",
            Email = "john@test.com",
            PhoneNumber = "555-0123",
            Address = "123 Test Street",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
            IsPortalEnabled = true,
            CreatedAt = DateTime.UtcNow
        };
        
        context.Customers.Add(testCustomer);
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
