import { InvoiceDetail } from "./InvoiceDetail";

export class InvoiceData {
  invoiceNumber: number = 0;
  invoiceDate: string = "";
  client: string = "";
  service: string = "";
  invoiceDetails: InvoiceDetail[] = [];
  instructions: string = "";
}
