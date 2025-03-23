using Microsoft.EntityFrameworkCore;
using Inventario.Models;

namespace Inventario.Data

// Esta clase es creada para configurar el contexto de nuestra base de datos para las tablas

{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Producto> Productos { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }
    }
}
