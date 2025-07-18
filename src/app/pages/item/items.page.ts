import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/dev.environment';

//Interfaces
import { Item } from '../../interfaces/item.interface';

//Modules
import { CommonModule } from '@angular/common';

///Services
import { CartService } from '../../services/cart/cart.service';
import { ItemService } from '../../services/item/item.service';
import { ManageItemComponent } from '../../shared/manage-item.component/manage-item.component';

@Component({
  selector: 'app-item',
  imports: [CommonModule, ManageItemComponent],
  templateUrl: './items.page.html',
  styleUrl: './items.page.scss'
})
export class ItemsPage {
  items$!: Observable<Item[]>;
  itemsSubscription!: Subscription;
  items: Item[] = [];
  quantityBuy: number = 0;
  showModal: boolean = false;

  constructor (
    private cartService: CartService,
    private router: Router, 
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.getItems();
    this.items$ = this.itemService.getAllItems();
    this.itemsSubscription = this.items$.subscribe((i) => {
      this.items = i;
    });
  }

  getItems () {
    this.itemService.getItems();
  }
  // getItems () {
  //   this.itemService.getItems().subscribe(items => {
  //     if (items.items != null && items.items != undefined) {
  //       this.items = items.items;
  //       this.itemService.setItemsToDisplay(this.items);
  //     }
  //   });
  // }

  addToCart (item: Item) {
    this.cartService.addToCart(item);
  }

  removeFromCart (item: Item) {
    this.cartService.removeFromCart(item);
  }

  getQuantityInCart (id: string) {
    return this.cartService.getQuantityBuy(id);
  }

  picture (contenthash: any) {
    return `${environment.backendUrl}/images/itemPic/${contenthash}`
  }

  openModal() {
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
  }
}
