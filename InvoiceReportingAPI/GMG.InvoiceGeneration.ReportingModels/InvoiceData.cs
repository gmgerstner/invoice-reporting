using System;
using System.Collections.Generic;

namespace GMG.InvoiceGeneration.ReportingModels
{
    public class InvoiceData
    {
        public int InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string Client { get; set; }
        public string Service { get; set; }
        public List<InvoiceDetail> InvoiceDetails { get; set; }
        public string Instructions { get; set; }
    }

    public class InvoiceDetail
    {
        public string Description { get; set; }
        public double? Hours { get; set; }
        public double? Rate { get; set; }
        public double Amount { get; set; }
    }
}
