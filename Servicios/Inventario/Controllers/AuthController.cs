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
            Password = BCrypt.Net.BCrypt.HashPassword(model.Password),
            Rol = model.Rol == "Administrador" ? "Empleado" : model.Rol // Restringe asignación de rol Administrador
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

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<object>>> GetUsers()
    {
        var usuarios = await _context.Usuarios
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Rol
            })
            .ToListAsync();

        return Ok(usuarios);
    }

    [HttpPut("update-role/{id}")]
    public async Task<ActionResult> UpdateUserRole(int id, [FromBody] UpdateRolModel model, [FromHeader] string adminEmail) {
        if (string.IsNullOrEmpty(model.NewRole))
        {
            return BadRequest(new { message = "El nuevo rol no puede estar vacío." });
        }

        var adminUser = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == adminEmail);
        if (adminUser == null || adminUser.Rol != "Administrador")
        {
            return Unauthorized(new { message = "Acceso denegado. Solo administradores pueden cambiar roles." });
        }

        var user = await _context.Usuarios.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado." });
        }

        user.Rol = model.NewRole;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rol actualizado correctamente." });
    }
}
