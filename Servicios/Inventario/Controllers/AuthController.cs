using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BCrypt.Net;
using Inventario.Models;
using Inventario.Data;
using System.Linq;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context) {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterUser model) {
        if (_context.Usuarios.Any(u => u.Email == model.Email))
        {
            return BadRequest(new { message = "El correo ya está registrado." });
        }

        var usuario = new Usuario
        {
            Name = model.Name,
            Email = model.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(model.Password), // Solo una vez
            Rol = model.Rol ?? "Empleado" // Valor por defecto si es nulo
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuario registrado con éxito." });
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginUser model) {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Name == model.Name);
        
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(model.Password, usuario.Password))
        {
            return Unauthorized(new { message = "Correo o contraseña incorrectos" });
        }

        return Ok(new { message = "Inicio de sesión exitoso", usuario = new { usuario.Id, usuario.Name, usuario.Email, usuario.Rol } });
    }

}
