using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Models
{
    /// <summary>
    /// Representa un detalle individual dentro de una compra.
    /// Incluye información del producto, cantidad, precios e impuestos aplicables.
    /// </summary>
    public class DetalleCompra
    {
        /// <summary>
        /// Identificador único del detalle de compra (clave primaria).
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Clave foránea que relaciona el detalle con una compra específica.
        /// </summary>
        public int CompraId { get; set; }

        /// <summary>
        /// Objeto de navegación hacia la entidad Compra.
        /// </summary>
        public Compra Compra { get; set; }

        /// <summary>
        /// Clave foránea del producto adquirido.
        /// </summary>
        public int ProductoId { get; set; }

        /// <summary>
        /// Objeto de navegación hacia el producto.
        /// </summary>
        public Producto Producto { get; set; }

        /// <summary>
        /// Cantidad de productos adquiridos en esta línea de detalle.
        /// </summary>
        public int Cantidad { get; set; }

        /// <summary>
        /// Precio unitario del producto en el momento de la compra.
        /// </summary>
        public decimal PrecioUnitario { get; set; }

        /// <summary>
        /// Subtotal calculado como Cantidad * PrecioUnitario.
        /// </summary>
        public decimal Subtotal { get; set; }

        /// <summary>
        /// Valor del IVA aplicado a esta línea de detalle.
        /// </summary>
        public decimal IVA { get; set; }
    }
}
