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
import { ItemService } from '../../services/item/item.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../services/langages/langages.service';

const SORT_KEY = 'sort-key';
@Component({
  selector: 'app-stock',
  imports: [CommonModule, RouterModule, AddItemComponent, DeleteItemComponent, UpdateItemComponent, TranslatePipe],
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
  isLoading: boolean = false;
  isAdmin: boolean = false;
  public stockChanges: { [key: string]: number } = {};

  constructor (
    private translateService: TranslateService,
    private langService: LangagesService,
    private router: Router, 
    private itemService: ItemService,
    private authService: AuthService,
    private toastService: ToastService
  ) { 
    this.translateService.use(this.langService.initLangage());
    this.filterSelect = this.loadFilterSelection();
    this.isAdmin = authService.isAdmin();
  }

  ngOnInit() {
    this.isLoading = true;
    this.refreshItems();
  }
  
  refreshItems() {
    this.itemService.getAllItems();
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

  getChangeValue(itemId: string): number {
    return this.stockChanges[itemId] || 0;
  }

  increment(itemId: string) {
    const current = this.getChangeValue(itemId);
    this.stockChanges[itemId] = current + 1;
  }

  decrement(itemId: string) {
    const current = this.getChangeValue(itemId);
    if (current > 0) {
      this.stockChanges[itemId] = current - 1;
    }
  }

  updateProductQuantity(item: any) {
    const addedQty = this.getChangeValue(item.id);
    if (addedQty <= 0) return;

    const datas = {
      qty: addedQty,
      mode: "relative"
    }
    
    this.itemService.updateStock(item.id, datas).subscribe({
      next: (res: any) => {
        this.refreshItems();
        console.log(res.body)
        if (res.status === 202) {
          this.toastService.warning(res.body.msg);
        } else {
          this.toastService.success(res.body.msg);
        }
        this.stockChanges[item.id] = 0;
      },
      error: (err: any) => {
        if (err.status >= 404 && err.status < 500) {
          this.toastService.error('Erreur : ' + err.error.msg);
        } else if (err.status >= 500 && err.status <= 511) {
          this.toastService.warning('Erreur : ' + err.error.msg);
        } else {
          this.toastService.warning('Erreur inconnue');
        }
      }
        //est-ce que on doit actualiser la page en fond (item) et garder le modal ouvert?
          // const currentUrl = this.router.url;
          // //remplacer true
          // if (currentUrl != "/cart") this.router.navigate(['']);
          // else this.router.navigate(['/checkout'])
          // console.log("LOGIN: USER CONNECTED");
    });
  }
}