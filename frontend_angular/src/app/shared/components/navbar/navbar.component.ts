import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Coupon } from '../../../interfaces/coupon.interface';
import { ItemCaisse } from '../../../interfaces/item.interface';
import { UserToDisplay } from '../../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../../services/langages/langages.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, TranslatePipe],
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

  languages = [
    {
      code: 'fr',
      labelKey: 'LANG.FR'
    },
    {
      code: 'en',
      labelKey: 'LANG.EN'
    },
    {
      code: 'es',
      labelKey: 'LANG.ES'
    }
  ];
  currentLang = this.languages[0];

  constructor(
    private router: Router, 
    public authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
    private translateService: TranslateService,
    private langService: LangagesService
  ) { 
    let lg = this.langService.initLangage();
    this.translateService.use(lg);
    if (lg === "fr") {
      this.currentLang = this.languages[0];
    } else if (lg === "en") {
      this.currentLang = this.languages[1];
    } else if (lg === "es") {
      this.currentLang = this.languages[2];
    }
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
    console.log(this.userToDisplay);
    this.authService.logOut();
    this.cartService.emptyCart();
    this.userService.clearData();
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleLanguagesDropdown() {
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

  changeLanguage (lang: string) {
    if (this.translateService.getCurrentLang() === lang) return;
    localStorage.removeItem('lang');
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
    if (lang === "fr") {
      this.currentLang = this.languages[0];
    } else if (lang === "en") {
      this.currentLang = this.languages[1];
    } else if (lang === "es") {
      this.currentLang = this.languages[2];
    }
    this.isLanguagesDropdownOpen = false;
  }
}
