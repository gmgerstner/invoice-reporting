import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { InvoiceData } from '../../models/InvoiceData';
import { InvoiceDetail } from '../../models/InvoiceDetail';
import { EditInvoiceDetailComponent } from '../../dialogs/edit-invoice-detail/edit-invoice-detail.component';
import { InvoiceGenerationService } from '../../services/invoice-generation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  displayedColumns = ['buttons', 'description', 'hours', 'rate', 'amount'];
  readonly dialog = inject(MatDialog);
  dataSource!: MatTableDataSource<InvoiceDetail>;
  blob: Blob | undefined = undefined;

  data: InvoiceData = {
    client: '',
    instructions: '',
    invoiceDate: '',
    invoiceDetails: [],
    invoiceNumber: 0,
    service: ''
  };

  constructor(private api: InvoiceGenerationService) { }

  ngOnInit(): void {
    let lastDataTxt = localStorage.getItem("lastData");
    if (lastDataTxt != null && lastDataTxt != "") {
      let lastData = JSON.parse(lastDataTxt);
      this.data = lastData;
    }
    else {
      let dt = new Date();
      this.data = {
        client: '',
        invoiceNumber: 0,
        invoiceDate: this.formatDate(dt),
        service: "Software Support",
        invoiceDetails: [],
        instructions: ''
      };
    }
    this.dataSource = new MatTableDataSource<InvoiceDetail>(this.data.invoiceDetails);
  }

  formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  onAddClick() {
    this.openAddDialog();
  }

  onEditClick(detail: InvoiceDetail) {
    this.openEditDialog(detail);
  }

  onDeleteClick(detail: InvoiceDetail) {
    const index = this.data.invoiceDetails.indexOf(detail);
    if (index > -1) {
      this.data.invoiceDetails.splice(index, 1);
      this.dataSource.data = this.data.invoiceDetails;
    }
  }

  onMoveDownClick(detail: InvoiceDetail) {
    const index = this.data.invoiceDetails.indexOf(detail);
    if (index != -1 && index < this.data.invoiceDetails.length - 1) {
      [this.data.invoiceDetails[index], this.data.invoiceDetails[index + 1]] = [this.data.invoiceDetails[index + 1], this.data.invoiceDetails[index]];
      this.dataSource.data = this.data.invoiceDetails;
    }
  }

  onMoveUpClick(detail: InvoiceDetail) {
    const index = this.data.invoiceDetails.indexOf(detail);
    if (index != -1 && index > 0) {
      [this.data.invoiceDetails[index], this.data.invoiceDetails[index - 1]] = [this.data.invoiceDetails[index - 1], this.data.invoiceDetails[index]];
      this.dataSource.data = this.data.invoiceDetails;
    }
  }

  openEditDialog(detail: InvoiceDetail): void {
    const copyDetail: InvoiceDetail = {
      description: detail.description,
      hours: detail.hours,
      amount: detail.amount,
      rate: detail.rate
    };

    const dialogRef = this.dialog.open(EditInvoiceDetailComponent, {
      //height: '400px',
      width: '600px',
      data: copyDetail,
    });

    dialogRef.afterClosed().subscribe((result: InvoiceDetail) => {
      if (result !== undefined) {
        detail.description = result.description;
        detail.hours = result.hours;
        detail.amount = result.amount;
        detail.rate = result.rate;
      }
    });

  }

  openAddDialog(): void {
    const detail: InvoiceDetail = {
      amount: 0,
      description: "",
      hours: 0,
      rate: 0
    };

    const dialogRef = this.dialog.open(EditInvoiceDetailComponent, {
      //height: '400px',
      width: '600px',
      data: detail,
    });

    dialogRef.afterClosed().subscribe((result: InvoiceDetail) => {
      if (result !== undefined) {
        detail.description = result.description;
        detail.hours = result.hours;
        detail.amount = result.amount;
        detail.rate = result.rate;

        this.data.invoiceDetails.push(detail);
        this.dataSource.data = this.data.invoiceDetails;
      }
    });

  }

  isFirstDetail(detail: InvoiceDetail): boolean {
    if (this.data.invoiceDetails.length <= 1) return true;
    if (this.data.invoiceDetails[0] === detail) return true;
    return false;
  }

  isLastDetail(detail: InvoiceDetail): boolean {
    if (this.data.invoiceDetails.length <= 1) return true;
    if (this.data.invoiceDetails[this.data.invoiceDetails.length - 1] === detail) return true;
    return false;
  }

  updateLastData() {
    const txt = JSON.stringify(this.data);
    localStorage.setItem("lastData", txt);
  }

  onPrintClick() {
    this.print();
    this.updateLastData();
  }

  print() {
    this.api.printReport(this.data).subscribe((data) => {
      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "invoice.pdf";
      link.click();
    }, error => {
      console.log(error);
      alert(error.message);
    });
  }

}
