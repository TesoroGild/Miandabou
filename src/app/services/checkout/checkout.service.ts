import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/dev.environment';
import { Item } from '../../interfaces/item.interface';
import { Order } from '../../interfaces/order.interface';
import { Address } from '../../interfaces/address.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private http: HttpClient) { }

  checkout(orderToCreate: any) : any {
    const jsonData = JSON.stringify(orderToCreate);
    return this.http.post<any>(
      `${environment.backendUrl}/api/checkout`, 
      jsonData
    );
  }

  setOrder(oder: Order) {
    console.log("SET ORDER");
    console.log(oder);
  }

  setOrderItems(orderItems: Item[]) {
    console.log("SET ORDER ITEMS");
    console.log(orderItems);
  }

  setShippingAddress(shippingAdress: Address) {
    console.log("SET SHIPPING ADDRESS");
    console.log(shippingAdress);
  }

  downloadBill () {}
}
