using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventario.Models
{
    /// <summary>
    /// Representa un proveedor en el sistema de inventario.
    /// Contiene información de contacto y ubicación del proveedor.
    /// </summary>
    public class Proveedor
    {
        /// <summary>
        /// Identificador único del proveedor (clave primaria).
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Nombre de la empresa o razón social del proveedor.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Nombre del contacto principal del proveedor.
        /// </summary>
        public string Contacto { get; set; }

        /// <summary>
        /// Teléfono del proveedor.
        /// </summary>
        public string Telefono { get; set; }

        /// <summary>
        /// Correo electrónico de contacto del proveedor.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Dirección física del proveedor.
        /// </summary>
        public string Direccion { get; set; }
    }
}
