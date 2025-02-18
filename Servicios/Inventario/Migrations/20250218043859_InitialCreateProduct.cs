using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Precio",
                table: "Productos",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Productos",
                newName: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Productos",
                newName: "Precio");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Productos",
                newName: "Nombre");
        }
    }
}
