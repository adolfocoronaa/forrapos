using Microsoft.EntityFrameworkCore;
using Inventario.Data;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureServices(services =>
                {
                    // Configurar el contexto de la base de datos para usar MySQL
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseMySql(
                            "server=localhost;database=forrapos;user=root;password=root",
                            ServerVersion.AutoDetect("server=localhost;database=forrapos;user=root;password=root"))
                    );

                    // Agregar controladores
                    services.AddControllers();

                    // Configuración de CORS
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
                    app.UseCors("AllowLocalhost");  // Habilitar CORS

                    app.UseRouting();
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                    });
                });
            });
}
