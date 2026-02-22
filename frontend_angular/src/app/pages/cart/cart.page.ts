import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Coupon } from '../../interfaces/coupon.interface';
import { ItemCart, Item } from '../../interfaces/item.interface';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { LoginComponent } from '../../shared/components/login/login.component';
import { CouponsComponent } from '../../shared/components/coupons/coupons.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, LoginComponent, CouponsComponent],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss'
})
export class CartPage {
   constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartService.getItemsCartToDisplay().subscribe(items => {
      this.cart = items;
    });
    this.cartService.getSubTotal().subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.cartService.getTvq().subscribe(tvq => {
      this.tvq = tvq;
    });
    this.cartService.getTps().subscribe(tps => {
      this.tps = tps;
    });
    this.cartService.getCartTotal().subscribe(total => {
      this.total = total;
    });
    this.cartService.getCouponTotal().subscribe(total => {
      this.couponsTotal = total;
    })
    this.cartService.getCoupons().subscribe(coupons => {
      this.coupons = coupons;
      this.checkboxStates = this.coupons.map(() => false);
    });
  }

  cart: ItemCart [] = [];
  total: number = 0;
  subTotal: number = 0;
  tvq: number = 0;
  tps: number = 0;
  couponsTotal: number = 0;
  paymentModal: boolean = false;
  showLoginModal: boolean = false;
  checkboxStates: boolean[] = [];
  showCouponsModal: boolean = false;
  coupons: Coupon[] = [];

  cartEmpty() {
    if (this.cart.length != 0)
      return false;
    else return true;
  }

  addToCart (item: Item) {
    this.cartService.addToCart(item);
  }

  decraseQuantityInCart (item: Item) {
    this.cartService.decraseQuantityInCart(item);
  }

  deleteFromCart (item: Item) {
    this.cartService.deleteFromCart(item);
  }

  updateQuantity(item: Item, qte: number) {
    this.cartService.updateQuantity(item, qte);
  }

  itemTotal (id: string) {
    return this.cartService.itemTotal(id);
  }

  subTotalCalculate () {
    return this.cartService.subTotalCalculate();
  }

  tvqCalculate () {
    return this.cartService.tvqCalculate();
  }

  tpsCalculate () {
    return this.cartService.tpsCalculate();
  }

  totalCalculate () {
    return this.cartService.totalCalculate();
  }

  isUserLoggedIn () {
    let userIsLoggedIn;
    this.authService.userIsLoggedIn.subscribe({
      next: (result) => {
        userIsLoggedIn = result;
      }
    });
    return userIsLoggedIn;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  picture (contenthash: string) {
    return `${environment.backendUrl}/uploads/images/${contenthash}`
  }

  checkoutPage() {
    this.router.navigate(['/checkout']);
  }

  openCouponsModal () {
    this.showCouponsModal = true;
  }

  closeCouponsModal () {
    this.showCouponsModal = false;
  }
}
