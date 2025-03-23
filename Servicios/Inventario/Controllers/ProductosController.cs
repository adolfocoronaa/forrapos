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
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Constructor del controlador que inyecta el contexto de base de datos.
        /// </summary>
        /// <param name="context">Instancia del contexto de base de datos</param>
        public ProductosController(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
