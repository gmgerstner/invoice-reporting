using GMG.InvoiceGeneration.ReportingModels;
using Microsoft.Reporting.NETCore;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace GMG.InvoiceGeneration.ReportAPI.Logic
{
    public class ReportService //: IReportService
    {
        public byte[] GenerateReportAsync(string reportName, InvoiceData data)
        {
            string fileDirPath = Assembly.GetExecutingAssembly().Location.Replace("GMG.InvoiceGeneration.ReportAPI.dll", string.Empty);
            string rdlcFilePath = string.Format("{0}{1}.rdlc", fileDirPath, reportName);
            Stream reportDefinition = new FileStream(rdlcFilePath, FileMode.Open, FileAccess.Read);
            LocalReport report = new();
            report.LoadReportDefinition(reportDefinition);
            report.DataSources.Add(new ReportDataSource("DetailsDataSet", data.InvoiceDetails));
            report.SetParameters(
            [
                new ReportParameter("InvoiceNumber", data.InvoiceNumber.ToString()),
                new ReportParameter("InvoiceDate", data.InvoiceDate.ToString()),
                new ReportParameter("Client", data.Client),
                new ReportParameter("Service", data.Service),
                new ReportParameter("Instructions", data.Instructions)
            ]);
            byte[] pdf = report.Render("PDF");
            return pdf;
        }
    }
}
