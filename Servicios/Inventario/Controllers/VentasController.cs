using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inventario.Data;
using Inventario.Models;

namespace Inventario.Controllers;

[ApiController]
[Route("api/ventas")]
public class VentasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VentasController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/ventas
    [HttpGet]
    public async Task<IActionResult> GetVentas()
    {
        var ventas = await _context.Ventas
            .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
            .ToListAsync();

        var response = ventas.Select(v => new {
            id = v.Id,
            fecha = v.Fecha,
            total = v.Total,
            estado = v.Total > 0 ? "Completado" : "Pendiente",
            detalles = v.Detalles.Select(d => new {
                producto = d.Producto.Name,
                cantidad = d.Cantidad,
                precioUnitario = d.PrecioUnitario,
                subtotal = d.Subtotal
            })
        });

        return Ok(response);
    }

    // POST: api/ventas
    [HttpPost]
    public async Task<IActionResult> CrearVenta([FromBody] Venta nuevaVenta)
    {
        nuevaVenta.Fecha = DateTime.Now;

        foreach (var detalle in nuevaVenta.Detalles)
        {
            detalle.Subtotal = detalle.Cantidad * detalle.PrecioUnitario;
            // Obtener precio del producto si no viene desde frontend
            if (detalle.Producto == null)
            {
                detalle.Producto = await _context.Productos.FindAsync(detalle.ProductoId);
            }
        }

        nuevaVenta.Total = nuevaVenta.Detalles.Sum(d => d.Subtotal);

        _context.Ventas.Add(nuevaVenta);
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Venta registrada correctamente", ventaId = nuevaVenta.Id });
    }
}
