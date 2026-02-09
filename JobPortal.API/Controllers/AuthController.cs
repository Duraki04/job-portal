using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var fullName = (dto.FullName ?? "").Trim();
            var email = (dto.Email ?? "").Trim().ToLowerInvariant();
            var password = dto.Password ?? "";
            var roleText = (dto.Role ?? "").Trim();

            if (string.IsNullOrWhiteSpace(fullName))
                return BadRequest("FullName is required.");

            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                return BadRequest("Password must be at least 6 characters.");

            if (await _context.Users.AnyAsync(u => u.Email == email))
                return BadRequest("User already exists.");

            if (!Enum.TryParse<UserRole>(roleText, ignoreCase: true, out var role))
                return BadRequest("Invalid role. Allowed: Admin, Employer, Candidate.");

            var user = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create empty profile by role (so frontend has something)
            if (user.Role == UserRole.Employer)
            {
                _context.Companies.Add(new Company
                {
                    UserId = user.Id,
                    Name = user.FullName,        // default
                    City = "N/A",
                    Industry = "N/A",
                    Description = ""
                });
            }
            else if (user.Role == UserRole.Candidate)
            {
                _context.Candidates.Add(new Candidate
                {
                    UserId = user.Id,
                    City = "N/A",
                    ExperienceLevel = "Junior"
                });
            }

            await _context.SaveChangesAsync();

            // ✅ Optional but very useful: auto-login after register
            var token = GenerateToken(user);

            return Ok(new
            {
                message = "User registered successfully",
                token,
                role = user.Role.ToString(),
                fullName = user.FullName,
                userId = user.Id
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = (dto.Email ?? "").Trim().ToLowerInvariant();
            var password = dto.Password ?? "";

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            var ok = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!ok)
                return Unauthorized("Invalid credentials.");

            var token = GenerateToken(user);

            return Ok(new
            {
                token,
                role = user.Role.ToString(),
                fullName = user.FullName,
                userId = user.Id
            });
        }

        private string GenerateToken(User user)
        {
            var jwtKey = _config["Jwt:Key"];
            var jwtIssuer = _config["Jwt:Issuer"];
            var jwtAudience = _config["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(jwtKey) ||
                string.IsNullOrWhiteSpace(jwtIssuer) ||
                string.IsNullOrWhiteSpace(jwtAudience))
            {
                throw new InvalidOperationException("JWT config is missing (Jwt:Key/Issuer/Audience).");
            }

            // ✅ Use ExpireMinutes from config (fallback 120)
            var expireMinutes = 120;
            var expRaw = _config["Jwt:ExpireMinutes"];
            if (int.TryParse(expRaw, out var parsed) && parsed > 0)
                expireMinutes = parsed;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("fullName", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
