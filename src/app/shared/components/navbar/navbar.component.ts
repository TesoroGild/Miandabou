import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../environments/dev.environment';
import { Coupon } from '../../../interfaces/coupon.interface';
import { ItemCaisse } from '../../../interfaces/item.interface';
import { UserToDisplay } from '../../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userToDisplay$!: Observable<UserToDisplay>;
  userToDisplay: UserToDisplay = {} as UserToDisplay;
  userSubscription: Subscription;
  items: ItemCaisse[] = [];
  isProfileDropdownOpen = false;
  isLanguagesDropdownOpen = false;
  subTotal: number = 0;
  total: number = 0;
  couponsTotal: number = 0;
  coupons: Coupon[] = [];
  registerModal = false;
  updateModal = false;

  constructor(
    private router: Router, 
    public authService: AuthService,
    private userService: UserService,
    private cartService: CartService
  ) { 
    this.userToDisplay$ = this.authService.getUserToDisplay();
    this.userSubscription = this.userToDisplay$.subscribe((u) => {
      this.userToDisplay = u;
    })
  }

  ngOnInit(): void {
    this.authService.userToDisplay.subscribe((data) => {
      this.userToDisplay = data;
    });
    this.cartService.getItemsCaisseToDisplay().subscribe(items => {
      this.items = items;
    });
    this.cartService.getCaisseSubTotal().subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.cartService.getCaisseTotal().subscribe(total => {
      this.total = total;
    });
    this.cartService.getCouponCaisseTotal().subscribe(total => {
      this.couponsTotal = total;
    })
    this.cartService.getCoupons().subscribe(coupons => {
      this.coupons = coupons;
    });
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isLoggedIn () {
    return this.authService.isLoggedIn();
  }

  logOut() {
    this.authService.logOut();
    this.cartService.emptyCart();
    this.userService.clearData();
  }

  toogleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toogleLanguagesDropdown() {
    this.isLanguagesDropdownOpen = !this.isLanguagesDropdownOpen;
  }

  picture() {
    if (this.userToDisplay.contenthash) return `${environment.backendUrl}/uploads/images/${this.userToDisplay.contenthash}`
    else return "/assets/img/user_icon.png";
  }

  selectedAllCoupons () {
    this.cartService.setAllCoupons();
  }

  setCoupon (coupon: Coupon, index: number) {
    this.cartService.setCoupon(coupon);
  }

  openRegisterModal () {
    this.registerModal = true;
  }

  closeRegisterModal () {
    this.registerModal = false;
  }

  openUpdateModal () {
    this.updateModal = true;
  }

  closeUpdateModal () {
    this.updateModal = false;
  }
}
