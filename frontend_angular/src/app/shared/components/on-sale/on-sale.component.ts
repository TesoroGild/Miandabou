import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemService } from '../../../services/item/item.service';
import { ItemOnSale } from '../../../interfaces/item.interface';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../../services/langages/langages.service';

@Component({
  selector: 'app-on-sale',
  imports: [TranslatePipe],
  templateUrl: './on-sale.component.html',
  styleUrl: './on-sale.component.scss'
})
export class OnSaleComponent {
  //@Input() isOpen = false;
  private _isOpen = false;
  @Input() coupon: any;
  @Input() 
  set isOpen(val:boolean) {
    this._isOpen = val;

    if (val) this.getItemsOnSale();
  }
  get isOpen() : boolean {
    return this._isOpen;
  }
  @Output() close = new EventEmitter<void>();
  isLoading: boolean = false;
  itemsOnSale: ItemOnSale[] = [];

  constructor(
    private translateService: TranslateService,
    private langService: LangagesService,
    private itemService: ItemService
  ) {
    this.translateService.use(this.langService.initLangage());
  }

  ngOnInit() {

  }

  getItemsOnSale() {
    this.isLoading = true;
    this.itemService.getItemsOnSale(this.coupon.id).subscribe({
      next: (res: any) => {
        this.itemsOnSale = res.items;
      }
    });
  }

  closeItemsOnSale() {
    this.close.emit();
  }

  displayDiscount() {
    if (this.coupon.rate != undefined && this.coupon.rate != "N/A" && this.coupon.rate != "")
      return this.coupon.rate + "%";
    else if (this.coupon.value != undefined && this.coupon.value != "N/A" && this.coupon.value != "")
      return this.coupon.value + "$";
    else return "0$";
  }

  calculateSalePrice(price: number) {
    if (this.coupon.rate != undefined && this.coupon.rate != "N/A" && this.coupon.rate != "")
      return Math.round((price - (this.coupon.rate * price / 100)) * 100) / 100;
    else if (this.coupon.value != undefined && this.coupon.value != "N/A" && this.coupon.value != "")
      return Math.round((price - this.coupon.value) * 100) / 100;
    else return price;
  }

  //displayDate() {
  displayDate() {
    let displaydate = new Date(this.coupon.expiration_date);
    return displaydate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
