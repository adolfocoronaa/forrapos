using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Models
{
    /// <summary>
    /// Representa un producto en el inventario.
    /// Contiene información básica como nombre, precio y stock disponible.
    /// </summary>
    public class Producto
    {
        /// <summary>
        /// Identificador único del producto (clave primaria).
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Nombre del producto.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Precio unitario del producto.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Cantidad disponible del producto en inventario.
        /// </summary>
        public int Stock { get; set; }

        /// <summary>
        /// Ruta o URL de la imagen del producto.
        /// </summary>
        public string? ImagenUrl { get; set; }
    }
}
