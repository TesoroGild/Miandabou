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
      labelKey: 'LANG.FR',
      svg: `<svg class="h-3.5 w-3.5 rounded-full me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512" transform="rotate(90)"
                >
                  <rect width="512" height="170.7" fill="#ed2939" />
                  <rect y="170.7" width="512" height="170.7" fill="#fff" />
                  <rect y="341.4" width="512" height="170.7" fill="#0052b4" />
                </svg>`
    },
    {
      code: 'en',
      labelKey: 'LANG.EN',
      svg: `<svg aria-hidden="true" class="h-3.5 w-3.5 rounded-full me-2" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-us" viewBox="0 0 512 512">
                  <g fill-rule="evenodd">
                    <g stroke-width="1pt">
                      <path fill="#bd3d44" d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"/>
                      <path fill="#fff" d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"/>
                    </g>
                    <path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)"/><path fill="#fff" d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z" transform="scale(3.9385)"/>
                  </g>
                </svg> `
    },
    {
      code: 'es',
      labelKey: 'LANG.ES',
      svg: `<svg aria-hidden="true" class="h-3.5 w-3.5 rounded-full me-2" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-es" viewBox="0 0 512 512">
                  <g fill-rule="evenodd">
                    <g stroke-width="1pt">
                      <path fill="#ff9900" d="M0 0h512v512H0z" />
                      <path fill="#ff0000" d="M0 0h512v256H0z" />
                    </g>
                  </g>
                </svg>`
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
