using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Models
{
    /// <summary>
    /// Representa una compra realizada a un proveedor.
    /// Contiene la fecha, proveedor asociado, monto total y sus detalles.
    /// </summary>
    public class Compra
    {
        /// <summary>
        /// Identificador único de la compra (clave primaria).
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Fecha en la que se realizó la compra.
        /// </summary>
        [Required]
        public DateTime Fecha { get; set; }

        /// <summary>
        /// Identificador del proveedor relacionado con la compra (clave foránea).
        /// </summary>
        public int ProveedorId { get; set; }

        /// <summary>
        /// Objeto proveedor relacionado con esta compra.
        /// </summary>
        public Proveedor Proveedor { get; set; }

        /// <summary>
        /// Total monetario de la compra.
        /// </summary>
        public decimal Total { get; set; }

        /// <summary>
        /// Colección de detalles asociados a esta compra (productos, cantidades, etc.).
        /// </summary>
        public ICollection<DetalleCompra> Detalles { get; set; } = new List<DetalleCompra>();
    }
}
