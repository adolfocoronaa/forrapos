public class VentaDTO
{
    public DateTime? Fecha { get; set; } // se puede editar si lo deseas

    public string MetodoPago { get; set; } = string.Empty;
    public List<DetalleVentaDTO> Detalles { get; set; } = new();
}

public class DetalleVentaDTO
{
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}