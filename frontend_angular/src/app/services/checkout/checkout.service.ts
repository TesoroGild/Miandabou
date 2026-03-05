import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  orderBill:any;
  addressBill:any;
  itemsBill:any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  checkout(orderToCreate: any) : any {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    const jsonData = JSON.stringify(orderToCreate);
    return this.http.post<any>(
      `${environment.backendUrl}/api/checkout`, 
      jsonData,
      { headers }
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

  downloadBill() {
    window.print();
  }
}
