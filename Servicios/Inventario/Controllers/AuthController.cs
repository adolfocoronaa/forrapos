using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BCrypt.Net;
using Inventario.Models;
using Inventario.Data;
using System.ComponentModel.DataAnnotations;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUser model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _context.Usuarios.AnyAsync(u => u.Email == model.Email))
        {
            return BadRequest(new { message = "El correo ya está en uso." });
        }
        
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
        var user = new Usuario 
        { 
            Name = model.Name, 
            Email = model.Email, 
            Password = hashedPassword 
        };
        
        await _context.Usuarios.AddAsync(user);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Usuario registrado correctamente." });
    }
}
