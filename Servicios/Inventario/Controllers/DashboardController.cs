using Inventario.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inventario.Data;

namespace Inventario.Controllers {
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context) {
            _context = context;
        }

        [HttpGet("estadisticas")]
        public async Task<IActionResult> GetEstadisticas() {
            var hoy = DateTime.Today;
            var semanaInicio = hoy.AddDays(-(int)hoy.DayOfWeek);

            var ventasHoy = await _context.Ventas
                .Where(v => v.Fecha.Date == hoy)
                .SumAsync(v => (decimal?)v.Total) ?? 0;

            var ventasSemana = await _context.Ventas
                .Where(v => v.Fecha >= semanaInicio)
                .SumAsync(v => (decimal?)v.Total) ?? 0;

            var itemsVendidosHoy = await _context.DetallesVenta
                .Where(d => d.Venta.Fecha.Date == hoy)
                .SumAsync(d => (int?)d.Cantidad) ?? 0;

            var ordenesActivas = await _context.Ventas
                .CountAsync(); // Aquí puedes filtrar si tienes estado

            var alertas = await _context.Productos
                .Where(p => p.Stock <= 5)
                .Select(p => new { p.Name, p.Stock })
                .ToListAsync();

            return Ok(new
            {
                ventasHoy,
                ventasSemana,
                itemsVendidosHoy,
                ordenesActivas,
                alertas
            });
        }
    }
}
