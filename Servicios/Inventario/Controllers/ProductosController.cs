using Microsoft.AspNetCore.Mvc;
using Inventario.Data;
using Inventario.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Inventario.Controllers
{
    /// <summary>
    /// Controlador API para operaciones relacionadas con productos.
    /// Expone endpoints para consultar los productos almacenados en la base de datos.
    /// </summary>
    [Route("api/productos")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        /// <summary>
        /// Constructor del controlador que inyecta el contexto de base de datos.
        /// </summary>
        /// <param name="context">Instancia del contexto de base de datos</param>
        public ProductosController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        /// <summary>
        /// Obtiene la lista de productos registrados en la base de datos.
        /// </summary>
        /// <returns>Lista de objetos Producto</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CrearProducto([FromForm] Producto producto, IFormFile? imagen)
        {
            if (imagen != null)
            {
                var rutaCarpeta = Path.Combine(_environment.WebRootPath, "imagenes/productos");
                if (!Directory.Exists(rutaCarpeta))
                {
                    Directory.CreateDirectory(rutaCarpeta);
                }

                var nombreArchivo = $"{Guid.NewGuid()}_{imagen.FileName}";
                var rutaCompleta = Path.Combine(rutaCarpeta, nombreArchivo);

                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await imagen.CopyToAsync(stream);
                }

                producto.ImagenUrl = $"/imagenes/productos/{nombreArchivo}";
            }

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Producto creado exitosamente.", producto });
        }
    }
}
