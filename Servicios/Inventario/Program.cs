using Microsoft.EntityFrameworkCore;
using Inventario.Data;

public class Program
{
    /// <summary>
    /// Punto de entrada principal de la aplicación.
    /// </summary>
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    /// <summary>
    /// Configura y construye el host de la aplicación.
    /// Define servicios, middleware y el contexto de base de datos.
    /// </summary>
    /// <param name="args">Argumentos de la línea de comandos</param>
    /// <returns>IHostBuilder configurado</returns>
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureServices(services =>
                {
                    // Configuración del contexto de base de datos con MySQL
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseMySql(
                            "server=localhost;database=forrapos;user=root;password=root",
                            ServerVersion.AutoDetect("server=localhost;database=forrapos;user=root;password=root"))
                    );

                    // Registro de los controladores para la API
                    services.AddControllers();

                    // Configuración de política CORS para permitir frontend en Angular (localhost:4200)
                    services.AddCors(options =>
                    {
                        options.AddPolicy("AllowLocalhost", builder =>
                        {
                            builder.WithOrigins("http://localhost:4200")
                                   .AllowAnyMethod()
                                   .AllowAnyHeader();
                        });
                    });
                });

                webBuilder.Configure(app =>
                {
                    // Activar la política CORS definida anteriormente
                    app.UseCors("AllowLocalhost");

                    app.UseRouting();

                    // Habilita archivos estáticos desde wwwroot
                    app.UseStaticFiles();

                    // Mapeo de endpoints de controladores
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                    });
                });
            });
}
