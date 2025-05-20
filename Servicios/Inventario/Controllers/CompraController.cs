using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inventario.Data;
using Inventario.Models;

namespace Inventario.Controllers;

[ApiController]
[Route("api/compras")]

public class CompraController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CompraController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CrearCompra([FromBody] CompraDTO dto)
    {
        var nuevaCompra = new Compra
        {
            Fecha = dto.Fecha ?? DateTime.Now,
            ProveedorId = dto.ProveedorId,
            Detalles = dto.Detalles.Select(d => new DetalleCompra
            {
                ProductoId = d.ProductoId,
                Cantidad = d.Cantidad,
                PrecioUnitario = d.PrecioUnitario,
                IVA = d.IVA,
                Subtotal = d.Cantidad * d.PrecioUnitario
            }).ToList()
        };

        nuevaCompra.Total = nuevaCompra.Detalles.Sum(d => d.Subtotal + d.IVA);

        _context.Compras.Add(nuevaCompra);
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Compra registrada correctamente", compraId = nuevaCompra.Id });
    }

    // Endpoint para filtrar las compras
    [HttpGet("filtradas")]
    public async Task<IActionResult> GetComprasFiltradas(
        [FromQuery] int? year,
        [FromQuery] int? mes,
        [FromQuery] string? estado,
        [FromQuery] decimal? minTotal,
        [FromQuery] decimal? maxTotal,
        [FromQuery] string? producto)
    {
        try
        {
            var query = _context.Compras
                .Include(c => c.Detalles)
                    .ThenInclude(d => d.Producto)
                .AsQueryable();

            if (year.HasValue)
                query = query.Where(c => c.Fecha.Year == year);

            if (mes.HasValue && mes.Value >= 1 && mes.Value <= 12)
                query = query.Where(c => c.Fecha.Month == mes);

            if (!string.IsNullOrEmpty(estado))
            {
                if (estado == "Completado")
                    query = query.Where(c => c.Total > 0);
                else if (estado == "Pendiente")
                    query = query.Where(c => c.Total == 0);
            }

            if (minTotal.HasValue)
                query = query.Where(c => c.Total >= minTotal);

            if (maxTotal.HasValue)
                query = query.Where(c => c.Total <= maxTotal);

            if (!string.IsNullOrEmpty(producto))
                query = query.Where(c => c.Detalles.Any(d => d.Producto.Name.Contains(producto)));

            var compras = await query.ToListAsync();

            var response = compras.Select(c => new
            {
                id = c.Id,
                folio = c.Folio,
                fecha = c.Fecha,
                total = c.Total,
                estado = c.Total > 0 ? "Completado" : "Pendiente",
                proveedor = c.Proveedor,
                detalles = c.Detalles.Select(d => new
                {
                    producto = d.Producto.Name,
                    cantidad = d.Cantidad,
                    precioUnitario = d.PrecioUnitario,
                    subtotal = d.Subtotal
                })
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
        }
    }
}