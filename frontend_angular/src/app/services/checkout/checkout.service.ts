import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  orderBill:any;
  addressBill:any;
  itemsBill:any[] = [];

  constructor(private http: HttpClient) { }

  checkout(orderToCreate: any) : any {
    const jsonData = JSON.stringify(orderToCreate);
    return this.http.post<any>(
      `${environment.backendUrl}/api/checkout`, 
      jsonData
    ).pipe(
      map((res: any) => {
        this.orderBill = res.order;
        this.addressBill = res.address;
        this.itemsBill = res.items;
        return res;
      }),
      catchError((err: any) => {
        return throwError(() => err);
      })
    );
  }

  downloadBill () {
    const elementToPrint = document.getElementById('invoice')!;

    if (!elementToPrint) return;

    html2canvas(elementToPrint, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
      
      pdf.setProperties({
        title: 'Facture',
        subject: 'Facture',
        author: 'Miandabou Accessoires',
      });

      pdf.save("miandabou-facture"+this.orderBill.ordercode+".pdf");
    })
  }
}
