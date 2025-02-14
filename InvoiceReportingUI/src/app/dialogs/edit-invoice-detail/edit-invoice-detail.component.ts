import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { InvoiceDetail } from '../../models/InvoiceDetail';

@Component({
  selector: 'app-edit-invoice-detail',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
 ],
  templateUrl: './edit-invoice-detail.component.html',
  styleUrl: './edit-invoice-detail.component.scss'
})
export class EditInvoiceDetailComponent implements OnInit {
  //readonly dialog = inject(MatDialog);

  //readonly dialogRef = inject(MatDialogRef<EditInvoiceDetailComponent>);
  //readonly detail: InvoiceDetail= inject<InvoiceDetail>(MAT_DIALOG_DATA);
  detail: InvoiceDetail= inject<InvoiceDetail>(MAT_DIALOG_DATA);

  //@Input() detail: InvoiceDetail = {
  //  amount: 0,
  //  description: '',
  //  hours: 0,
  //  rate: 0
  //};

  constructor(public dialogRef: MatDialogRef<EditInvoiceDetailComponent>) { }

  ngOnInit(): void {
  }

  onSaveClick() {
    this.dialogRef.close(this.detail);
  }

  calculate() {
    let amount = this.detail.rate! * this.detail.hours!;
    if (Number.isFinite(amount) && amount != 0) {
      this.detail.amount = amount;
    }
  }

}
