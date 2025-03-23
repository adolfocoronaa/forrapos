using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Models
{
    /// <summary>
    /// Representa una venta realizada en el sistema.
    /// Contiene información como fecha, total y los productos vendidos.
    /// </summary>
    public class Venta
    {
        /// <summary>
        /// Identificador único de la venta (clave primaria).
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Fecha en la que se realizó la venta.
        /// </summary>
        public DateTime Fecha { get; set; }

        /// <summary>
        /// Monto total de la venta.
        /// </summary>
        public decimal Total { get; set; }

        /// <summary>
        /// Lista de detalles de productos vendidos en esta venta.
        /// </summary>
        public ICollection<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();
    }
}
