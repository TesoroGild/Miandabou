import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { Coupon } from '../../../interfaces/coupon.interface';

@Component({
  selector: 'app-coupons-comp',
  imports: [CommonModule],
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

  constructor(private cartService: CartService) { }

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
