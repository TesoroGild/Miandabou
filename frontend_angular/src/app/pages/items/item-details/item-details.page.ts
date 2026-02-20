import { Component } from '@angular/core';
import { Item } from '../../../interfaces/item.interface';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../services/item/item.service';
import { environment } from '../../../../environments/environment';
import { CartService } from '../../../services/cart/cart.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-item-details',
  imports: [],
  templateUrl: './item-details.page.html',
  styleUrl: './item-details.page.scss'
})
export class ItemDetailsPage {
  itemToDetail: Item = {
    id: "",
    gender: "",
    category: "",
    name: "",
    description : "",
    picture: "",
    contenthash : "",
    video : "",
    price : "",
    qte: "",
    quantityS: 0,
    quantityM: 0,
    quantityL: 0,
    quantityXl: 0,
    promo: 0,
    datePromoFin: "",
    //penser a faire un tableau de rate car ce n'est pas une seule personne qui note le produit
    rate: 0,
    totalSell: 0,
  };
  tmpItemToDetail: any;

  constructor ( 
    private route: ActivatedRoute, 
    private itemService: ItemService,
    private cartService: CartService,
    private toastService: ToastService
  ) { }
  
  ngOnInit() {
    this.tmpItemToDetail = history.state.data;

    if (!this.tmpItemToDetail.id && this.tmpItemToDetail.id.trim()) {
      const slug = this.route.snapshot.paramMap.get('name');

      if (slug) {
        const id = slug.split('-')[0];
        this.itemService.getItemById(+id).subscribe(( res: any) => {
          this.tmpItemToDetail = res;
          console.log(this.tmpItemToDetail);
          console.log(res);
        });
      }
    }
  }

  picture (contenthash: any) {
    return `${environment.backendUrl}/uploads/images/${contenthash}`
  }

  addToCart(item: Item, qte: number) {
    this.cartService.updateQuantity(item, qte);
    this.toastService.info("Voir le panier");
  }
}
