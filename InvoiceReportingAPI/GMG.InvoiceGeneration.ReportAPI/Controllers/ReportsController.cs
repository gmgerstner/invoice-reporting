using GMG.InvoiceGeneration.ReportAPI.Logic;
using GMG.InvoiceGeneration.ReportingModels;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace GMG.InvoiceGeneration.ReportAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportsController : ControllerBase
    {
        private ReportService _reportService = new();

        public ReportsController()
        {
        }

        [HttpPost]
        public FileResult Print(InvoiceData data)
        {
            try
            {
                //see: http://blog.geveo.com/IntegratingRDLCReportsToNetCoreProjects
                var reportData = _reportService.GenerateReportAsync("Invoice", data);
                return File(reportData, System.Net.Mime.MediaTypeNames.Application.Octet, "Invoice" + ".pdf");

            }
            catch (System.Exception ex)
            {
                Log.Error(ex, ex.ToString());
                throw;
            }
        }
    }
}
