import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { Coupon } from '../../../interfaces/coupon.interface';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../../services/langages/langages.service';

@Component({
  selector: 'app-coupons-comp',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent {
  @Input() isCouponsOpen = false;
  @Output() closeCoupons = new EventEmitter<void>();
  checkboxStates: boolean[] = [];
  coupons: Coupon[] = [];
  couponsSelected: Coupon[] = [];
  couponsTotal: number = 0;

  constructor(
    private translateService: TranslateService,
    private langService: LangagesService,
    private cartService: CartService
  ) { 
    this.translateService.use(this.langService.initLangage());
  }

  ngOnInit() {
    this.cartService.getCoupons().subscribe(coupons => {
      this.coupons = coupons;
      this.checkboxStates = this.coupons.map(() => false);
    });
  }
  
  closeCouponsModal() {
    this.closeCoupons.emit();
  }

  selectedAllCoupons () {
    this.cartService.setAllCoupons();
  }

  setCoupon (coupon: Coupon, index: number) {
    this.checkboxStates[index] = !this.checkboxStates[index];
    this.cartService.setCoupon(coupon);
  }

  cancelCoupons () {
    this.closeCouponsModal();
    this.cartService.cancelCoupons();  
  }

  applyCoupons () {
    this.closeCouponsModal();
    return this.cartService.couponCalculate();
  }

  applyAllCoupons () {
    this.closeCouponsModal();
    this.selectedAllCoupons();
    return this.cartService.couponCalculate();
  }

  displayDate(date: any) {
    let displaydate = new Date(date.date);
    return displaydate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
