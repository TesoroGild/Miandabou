import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

//Components
import { AddItemComponent } from '../../shared/components/manage-item/add-item/add-item.component';
import { DeleteItemComponent } from "../../shared/components/manage-item/delete-item/delete-item.component";
import { UpdateItemComponent } from "../../shared/components/manage-item/update-item/update-item.component";

//Interfaces
import { Item } from '../../interfaces/item.interface';

///Services
import { CartService } from '../../services/cart/cart.service';
import { ItemService } from '../../services/item/item.service';
import { FormsModule } from '@angular/forms';

const SORT_KEY = 'sort-key';
@Component({
  selector: 'app-stock',
  imports: [CommonModule, RouterModule, AddItemComponent, DeleteItemComponent, UpdateItemComponent],
  templateUrl: './stock.page.html',
  styleUrl: './stock.page.scss'
})
export class StockPage {
  itemsSubscription!: Subscription;
  items: Item[] = [];
  quantityBuy: number = 0;
  showAddItemModal: boolean = false;
  showDeleteItemModal: boolean = false;
  showUpdateItemModal: boolean = false;
  filterSelect: string;
  itemsToDisplay: Item[] = [];
  selectedItem: any;

  constructor (
    private cartService: CartService,
    private router: Router, 
    private itemService: ItemService
  ) { 
    this.filterSelect = this.loadFilterSelection();
  }

  ngOnInit() {
      this.refreshItems();
    }
  
    refreshItems() {
      this.itemService.getItems();
      this.itemsSubscription = this.itemService.getItems().subscribe((i) => {
        this.items = i;
        this.filterItems();
      });
    }
  
    getItems () {
      this.itemService.getItems();
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
  
    openUpdateItemModal(item: any) {
      this.showUpdateItemModal = true;
      this.selectedItem = item;
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

    updateProductQuantity() {

    }
}
