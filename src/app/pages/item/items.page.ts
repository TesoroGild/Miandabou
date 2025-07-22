import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/dev.environment';

//Components
import { ManageItemComponent } from '../../shared/components/manage-item/manage-item.component';

//Interfaces
import { Item } from '../../interfaces/item.interface';

//Modules
import { CommonModule } from '@angular/common';

///Services
import { CartService } from '../../services/cart/cart.service';
import { ItemService } from '../../services/item/item.service';
import { ToastService } from '../../services/toast/toast.service';
import { FormsModule } from '@angular/forms';

const SORT_KEY = 'sort-key';
@Component({
  selector: 'app-item',
  imports: [CommonModule, ManageItemComponent, RouterModule, FormsModule],
  templateUrl: './items.page.html',
  styleUrl: './items.page.scss'
})
export class ItemsPage {
  items$!: Observable<Item[]>;
  itemsSubscription!: Subscription;
  items: Item[] = [];
  quantityBuy: number = 0;
  showAddItemModal: boolean = false;
  filterSelect: string;
  itemsToDisplay: Item[] = [];

  constructor (
    private cartService: CartService,
    private router: Router, 
    private itemService: ItemService,
    private toasttest: ToastService
  ) { 
    this.filterSelect = this.loadFilterSelection();
  }

  ngOnInit() {
    this.refreshItems();
    //this.filterItems();
  }

  refreshItems() {
    this.getItems();
    this.items$ = this.itemService.getAllItems();
    this.itemsSubscription = this.items$.subscribe((i) => {
      this.items = i;
      this.filterItems();
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
    console.log(item);
    this.cartService.addToCart(item);
  }

  removeFromCart (item: Item) {
    this.cartService.removeFromCart(item);
  }

  getQuantityInCart (id: string) {
    return this.cartService.getQuantityBuy(id);
  }

  picture (contenthash: any) {
    return `${environment.backendUrl}/uploads/images/${contenthash}`
  }

  openAddItemModal() {
    this.showAddItemModal = true
  }

  closeModal() {
    this.showAddItemModal = false
  }

  showItemDetails(id: string) {
    var idToSearch : number = +id;
    console.log("TODO : " + idToSearch);
  }

  filterItems() {
    this.itemsToDisplay = [];
    switch (this.filterSelect) {
      case 'default':
        this.itemsToDisplay = this.items;
        break;

      case 'sortByPriceAsc':
        this.itemsToDisplay = this.items.sort(
          (a, b) => Number(a.price) - Number(b.price)
        );
        break;

      case 'sortByPriceDesc':
        this.itemsToDisplay = this.items.sort(
          (a, b) => Number(b.price) - Number(a.price)
        );
        break;

      case 'sortByNameAsc':
        this.itemsToDisplay = this.items.sort(
          (a, b) => a.name.localeCompare(b.name)
        );
        break;

      case 'sortByNameDesc':
        this.itemsToDisplay = this.items.sort(
          (a, b) => b.name.localeCompare(a.name)
        );
        break;

      // case 'sortByRateAsc':
      //   this.itemsToDisplay = this.items.sort(
      //     (a, b) => a.name.localeCompare(b.name)
      //   );
      //   break;

      // case 'sortByRateDesc':
      //   this.itemsToDisplay = this.items.sort(
      //     (a, b) => b.name.localeCompare(a.name)
      //   );
      //  break;

      // case 'sortByLessSell':
      //   this.itemsToDisplay = this.items.sort(
      //     (a, b) => a.name.localeCompare(b.name)
      //   );
      //   break;

      // case 'sortByMostSell':
      //   this.itemsToDisplay = this.items.sort(
      //     (a, b) => b.name.localeCompare(a.name)
      //   );
      //   break;

      default:
        this.itemsToDisplay = this.items;
        break;
    }
    this.saveFilterSelection();
  }

  saveFilterSelection() {
    localStorage.setItem(SORT_KEY, this.filterSelect);
  }

  loadFilterSelection(): string {
    if (localStorage.getItem(SORT_KEY) == null) {
      return 'sortByPriceAsc';
    } else {
      return String(localStorage.getItem(SORT_KEY));
    }
  }
}
