import { Component } from '@angular/core';
import { Address } from '../../interfaces/address.interface';
import { Order } from '../../interfaces/order.interface';
import { UserToDisplay } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { Item } from '../../interfaces/item.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/dev.environment';

@Component({
  selector: 'app-bills',
  imports: [CommonModule],
  templateUrl: './bills.page.html',
  styleUrl: './bills.page.scss'
})
export class BillsPage {
  order: Order;
  userToDisplay: UserToDisplay;
  shippingAddress: Address;
  subTotal: number = 0;
  coupons: number = 0;
  delivery: number = 0;
  tvq: number = 0;
  tps: number = 0;
  total: number = 0;
  items: Item[];

  constructor(
    private authService: AuthService, 
    private cartService: CartService, 
    private checkoutService: CheckoutService, 
    private http: HttpClient
  ) {
    this.order = {} as Order;
    this.userToDisplay = {} as UserToDisplay;
    this.shippingAddress = {} as Address;
    this.items = [];
  }

  picture(contenthash: string) {
    if (this.userToDisplay.contenthash) return `${environment.backendUrl}/uploads/images/${this.userToDisplay.contenthash}`
    else return null;
  }

  downloadBill() {
    this.checkoutService.downloadBill();
  }
}
