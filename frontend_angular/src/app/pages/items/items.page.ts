import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

//Interfaces
import { Item } from '../../interfaces/item.interface';

//Modules
import { CommonModule } from '@angular/common';

///Services
import { CartService } from '../../services/cart/cart.service';
import { ItemService } from '../../services/item/item.service';
import { FormsModule } from '@angular/forms';

const SORT_KEY = 'sort-key';
@Component({
  selector: 'app-item',
  imports: [CommonModule, RouterModule, FormsModule, ],
  templateUrl: './items.page.html',
  styleUrl: './items.page.scss'
})
export class ItemsPage {
  itemsState$!: Observable<{ loading: boolean, data?: any[], error?: any }>;
  itemsSubscription!: Subscription;
  items: Item[] = [];
  quantityBuy: number = 0;
  showAddItemModal: boolean = false;
  showDeleteItemModal: boolean = false;
  showUpdateItemModal: boolean = false;
  filterSelect: string;
  itemsToDisplay: Item[] = [];
  selectedItem: any;
  isLoading: boolean = false;

  constructor (
    private cartService: CartService,
    private router: Router, 
    private itemService: ItemService
  ) { 
    this.filterSelect = this.loadFilterSelection();
  }

  ngOnInit() {
    this.isLoading = true;
    this.refreshItems();
  }

  refreshItems() {
    this.itemService.getActiveItems();
    // this.itemsSubscription = this.itemService.getItems().subscribe((i) => {
    //   this.items = i;
    //   this.filterItems();
    // })
    this.itemsSubscription = this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.filterItems();
        //Not the best solution but...
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
      }
    })
  }

  addToCart (item: Item) {
    this.cartService.addToCart(item);
  }

  decraseQuantityInCart (item: Item) {
    this.cartService.decraseQuantityInCart(item);
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

  closeAddModal() {
    this.showAddItemModal = false
  }

  openDeleteItemModal(item: any) {
    this.showDeleteItemModal = true;
    this.selectedItem = item;
  }

  closeDeleteModal() {
    this.showDeleteItemModal = false;
    this.selectedItem = null;
  }

  openUpdateItemModal() {
    this.showUpdateItemModal = true;
  }

  closeUpdateModal() {
    this.showUpdateItemModal = false;
  }

  showItemDetails(item: Item) {
    const urlFriendlyName = item.name.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate(['/items', item.id + "-" + urlFriendlyName], { state: { data: item } })
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
