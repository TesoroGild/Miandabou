import { Component } from '@angular/core';
import { CouponsComponent } from '../../shared/components/coupons/coupons.component';

@Component({
  selector: 'app-coupons-page',
  imports: [CouponsComponent],
  templateUrl: './coupons.page.html',
  styleUrl: './coupons.page.scss'
})
export class CouponsPage {
  showCouponsModal: boolean = false;

  closeCouponsModal() {
    this.showCouponsModal = false
  }
}
