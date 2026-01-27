import { Component } from '@angular/core';
import { UserToDisplay } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-bills',
  imports: [CommonModule],
  templateUrl: './bills.page.html',
  styleUrl: './bills.page.scss'
})
export class BillsPage {
  // order: Order;
  // shippingAddress: Address;
  // items: ItemToOrder[];
  order: any;
  shippingAddress: any;
  items: any[] = [];
  userToDisplay$!: Observable<UserToDisplay>;
  userToDisplay: UserToDisplay = {} as UserToDisplay;
  userSubscription: Subscription;
  subTotal: number = 0;
  coupons: number = 0;
  delivery: number = 0;
  tvq: number = 0;
  tps: number = 0;

  constructor(
    private authService: AuthService, 
    private cartService: CartService, 
    private checkoutService: CheckoutService
  ) { 
    this.userToDisplay$ = this.authService.getUserToDisplay();
    this.userSubscription = this.userToDisplay$.subscribe((u) => {
      this.userToDisplay = u;
    })
  }

  ngOnInit() {
    this.authService.userToDisplay.subscribe((data) => {
      this.userToDisplay = data;
    });
    this.order = this.checkoutService.orderBill;
    this.shippingAddress = this.checkoutService.addressBill;
    this.items = this.checkoutService.itemsBill;
    this.cartService.getCartTotal().subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.cartService.getDelivery().subscribe(delivery => {
      this.delivery = delivery;
    });
    this.cartService.getTvq().subscribe(tvq => {
      this.tvq = tvq;
    });
    this.cartService.getTps().subscribe(tps => {
      this.tps = tps;
    });
    this.cartService.getCouponTotal().subscribe(coupons => {
      this.coupons = coupons;
    })
  }

  picture(contenthash: string) {
    if (contenthash) return `${environment.backendUrl}/uploads/images/${contenthash}`
    else return null;
  }

  downloadBill() {
    this.checkoutService.downloadBill();
  }

  displayDate(date: any) {
    let displaydate = new Date(date.date);
    return displaydate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  displayMessage(communicationchannel: string) {
    if (communicationchannel == "emailcommunication") return "Nous converserons avec vous via cette adresse mail " +  + " pour toutes mises à jour.";
    else if (communicationchannel == "phonecommunication") return "Nous converserons avec vous via ce numéro de téléphone {{ displayMessage(order.communicationchannel) }} pour toutes mises à jour.";
    else if (communicationchannel == "nonecommunication") return "Nous ne communiquerons pas avec vous conformement à votre choix.";
    else return null;
  }
}
