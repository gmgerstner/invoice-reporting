import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InvoiceData } from '../models/InvoiceData';

@Injectable({
  providedIn: 'root'
})
export class InvoiceGenerationService {
  private http = inject(HttpClient);
  constructor() { }

  printReport(data: InvoiceData): Observable<any> {
    //clean data
    for (let i = 0; i < data.invoiceDetails.length; i++) {
      if (data.invoiceDetails[i].hours != null && data.invoiceDetails[i].hours!.toString() == "") data.invoiceDetails[i].hours = null;
      if (data.invoiceDetails[i].rate != null && data.invoiceDetails[i].rate!.toString() == "") data.invoiceDetails[i].rate = null;
    }

    //see: https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
    let url = `${environment.ApiUrl}/Reports`;
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.post(url, data, httpOptions);
  }
}
