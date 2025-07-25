import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private http: HttpClient) { }

  order (orderToCreate: FormData) : any {
    console.log(orderToCreate);
    console.log("TEST ORDER");
  }

  downloadBill () {

  }
}
