using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.MSSqlServer;
using System;
using System.IO;

namespace GMG.InvoiceGeneration.ReportAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var isDev = (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "") == "Development";
            IConfigurationRoot configuration;
            if (isDev)
            {
                configuration = new ConfigurationBuilder()
                      .SetBasePath(Directory.GetCurrentDirectory())
                      .AddJsonFile("appsettings.json")
                      .AddJsonFile("appsettings.Development.json")
                      .Build();
            }
            else
            {
                configuration = new ConfigurationBuilder()
                      .SetBasePath(Directory.GetCurrentDirectory())
                      .AddJsonFile("appsettings.json")
                      .Build();
            }
            var applicationName = System.Reflection.Assembly.GetExecutingAssembly().GetName().Name;
            var logDB = $"{configuration["ConnectionStrings:SerilogDb"]};app={applicationName}";
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Warning()
                .WriteTo.MSSqlServer(
                    connectionString: logDB,
                    sinkOptions: new MSSqlServerSinkOptions { TableName = "Logs" }
                    )
                .CreateLogger();

            try
            {
                Log.Information("Starting up Invoice Generation API");
                CreateHostBuilder(args).Build().Run();

            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Invoice Generation API Application start-up failed");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
