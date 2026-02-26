import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

//Interfaces
import { Coupon } from '../../interfaces/coupon.interface';
import { Item, ItemCaisse, ItemCart } from '../../interfaces/item.interface';

//Services
import { ItemService } from '../item/item.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items$!: Observable<Item[]>;
  itemsSubscription: Subscription;
  items: Item[] = [];
  private itemsCartSubject: BehaviorSubject<ItemCart[]>;
  private itemsCaisseSubject: BehaviorSubject<ItemCaisse[]>;
  private cartTotalSubject: BehaviorSubject<number>;
  private caisseTotalSubject: BehaviorSubject<number>;
  private checkoutTotalSubject: BehaviorSubject<number>;
  private subTotalSubject: BehaviorSubject<number>;
  private subTotalCaisseSubject: BehaviorSubject<number>;
  private tvqSubject: BehaviorSubject<number>;
  private tpsSubject: BehaviorSubject<number>;
  private deliverySubject: BehaviorSubject<number>;
  private couponsSubject: BehaviorSubject<Coupon[]>;
  private couponsTotalSubject: BehaviorSubject<number>;
  private couponsCaisseTotalSubject: BehaviorSubject<number>;
  total: number = 0;

  cart: ItemCart[] = [];
  caisse: ItemCaisse[] = [];
  cartTotal: number = 0;
  caisseTotal: number = 0;
  subTotal: number = 0;
  subTotalCaisse: number = 0;
  tvqRate: number = 9.975;
  tvq: string = "0";
  tpsRate: number = 5;
  tps: string = "0";
  delivery: number = 50;
  couponTotal: number = 0;
  caisseCouponTotal: number = 0;
  coupons: Coupon[] = [];
  couponsSelected: Coupon[] = [];

  constructor (
    private itemService: ItemService,
    private http: HttpClient
  ) {
    this.items$ = this.itemService.getItems();
    this.itemsSubscription = this.items$.subscribe((i) => {
      this.items = i;
    });
    this.itemsCartSubject = new BehaviorSubject<ItemCart[]>([]);
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.itemsCartSubject.next(JSON.parse(savedCart));
    }
    this.itemsCaisseSubject = new BehaviorSubject<ItemCaisse[]>([]); 
    this.cartTotalSubject = new BehaviorSubject<number>(0);
    const savedTotal = localStorage.getItem("total");
    if (savedTotal) {
      this.cartTotalSubject.next(JSON.parse(savedTotal));
    }
    this.caisseTotalSubject = new BehaviorSubject<number>(0);
    this.checkoutTotalSubject = new BehaviorSubject<number>(0);
    this.subTotalSubject = new BehaviorSubject<number>(0);
    const savedSubTotal = localStorage.getItem("subTotal");
    if (savedSubTotal) {
      this.subTotalSubject.next(JSON.parse(savedSubTotal));
    }
    this.subTotalCaisseSubject = new BehaviorSubject<number>(0);
    this.tvqSubject = new BehaviorSubject<number>(0);
    const savedTvq = localStorage.getItem("tvq");
    if (savedTvq) {
      this.tvqSubject.next(JSON.parse(savedTvq));
    }
    this.tpsSubject = new BehaviorSubject<number>(0);
    const savedTps = localStorage.getItem("tps");
    if (savedTps) {
      this.tpsSubject.next(JSON.parse(savedTps));
    }
    const savedTestTotal = localStorage.getItem("total");
    if (savedTestTotal) {
      this.total = +savedTestTotal;
    }
    this.couponsTotalSubject = new BehaviorSubject<number>(0);
    this.couponsCaisseTotalSubject = new BehaviorSubject<number>(0);
    this.couponsSubject = new BehaviorSubject<Coupon[]>([]);
    const savedCoupons = localStorage.getItem("coupons");
    if (savedCoupons) {
      this.couponsSubject.next(JSON.parse(savedCoupons));
    }
    this.deliverySubject = new BehaviorSubject<number>(50);
  }

  setItemsCartToDisplay (items: ItemCart[]) {
    this.itemsCartSubject.next(items);
  }

  getItemsCartToDisplay () {
    return this.itemsCartSubject.asObservable();
  }

  getItemsCaisseToDisplay () {
    return this.itemsCaisseSubject.asObservable();
  }

  getQuantityBuy (id: string) {
    let quantity = this.cart.find(item => item.item.id === id)?.quantityBuy;
    if (quantity) return quantity;
    else return 0;
  }

  emptyCart () {
    this.cart = [];
  }

  addToCart (itemToAdd: Item) {
    const index = this.cart.findIndex(item => item.item.id === itemToAdd.id);
    if (index !== -1) {
      this.cart[index].quantityBuy += 1;
    } else {
      this.cart.push({ item: itemToAdd, quantityBuy: 1 });
    }
    this.itemsCartSubject.next(this.cart);
    this.subTotalCalculate();
    this.saveCartToLocalStorage();
  }

  saveCartToLocalStorage () {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  decraseQuantityInCart (itemToRemove: Item) {
    const index = this.cart.findIndex(item => item.item.id === itemToRemove.id);
    if (index !== -1) {
      if (this.cart[index].quantityBuy > 1) {
        this.cart[index].quantityBuy -= 1;
      } else {
        this.cart.splice(index, 1);
      }
      this.itemsCartSubject.next(this.cart);
      this.subTotalCalculate();
      this.saveCartToLocalStorage();
    }
  }

  deleteFromCart (itemToDelete: Item) {
    this.cart = this.cart.filter(item => item.item.id !== itemToDelete.id);
    this.itemsCartSubject.next(this.cart);
    this.subTotalCalculate();
    this.saveCartToLocalStorage();
  }

  updateQuantity(itemToModify: Item, qte: number) {
    const index = this.cart.findIndex(item => item.item.id === itemToModify.id);
    if (index !== -1) {
      if (qte > 0) {
        this.cart[index].quantityBuy += qte;
      } else if (qte) {
        this.deleteFromCart(itemToModify);
      }
      this.itemsCartSubject.next(this.cart);
      this.subTotalCalculate();
      this.saveCartToLocalStorage();
    } else {
      if (qte > 0) {
        this.cart.push({ item: itemToModify, quantityBuy: qte });
        this.itemsCartSubject.next(this.cart);
        this.subTotalCalculate();
        this.saveCartToLocalStorage();
      }
    }
  }

  addOnCaisse (id: string) {
    //ajouter une verification avec les articles en stock
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      const itemToAdd: ItemCaisse = {
        id: id,
        name: this.items[index].name,
        price: this.items[index].price,
        promo: this.items[index].promo,
        rate: this.items[index].rate
      }
      this.caisse.push(itemToAdd);
    }
    this.itemsCaisseSubject.next(this.caisse);
    this.subTotalCaisseCalculate();
  }

  removeOnCaisse (id: string) {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
    } else {
      this.caisse.splice(index, 1);
    }
    this.itemsCaisseSubject.next(this.caisse);
    this.subTotalCaisseCalculate();
  }

  itemTotal (id: string) {
    let quantity = this.cart.find(it => it.item.id === id)?.quantityBuy;
    let price = this.cart.find(it => it.item.id === id)?.item.price;
    if (quantity && price) return quantity * Number(price);
    else return 0;
  }

  subTotalCalculate () {
    this.subTotal = this.cart.reduce((subTotal, cartItem) => {
      return subTotal + (Number(cartItem.item.price) * cartItem.quantityBuy);
    }, 0);
    this.subTotalSubject.next(parseFloat(this.subTotal.toFixed(2)));
    this.saveSubTotalToLocalStorage();
    this.tvqCalculate();
  }

  saveSubTotalToLocalStorage() {
    localStorage.setItem("subTotal", JSON.stringify(this.subTotal));
  }

  subTotalCaisseCalculate () {
    this.subTotalCaisse = this.caisse.reduce((subTotalCaisse, item) => {
      return subTotalCaisse + (Number(item.price) - (Number(item.price) * (item.rate / 100)) - (item.promo));
    }, 0);
    const tvq = this.subTotalCaisse * (this.tvqRate / 100);
    const tps = this.subTotalCaisse * (this.tpsRate / 100);
    this.subTotalCaisse = parseFloat((this.subTotalCaisse + tvq + tps).toFixed(2));
    this.subTotalCaisseSubject.next(this.subTotalCaisse);
    this.caisseCouponCalculate();
  }

  getSubTotal () {
    return this.subTotalSubject.asObservable();
  }

  getCaisseSubTotal () {
    return this.subTotalCaisseSubject.asObservable();
  }

  tvqCalculate () {
    this.tvq = (this.subTotal * (this.tvqRate / 100)).toFixed(2);
    this.tvqSubject.next(parseFloat(this.tvq));
    this.saveTvqToLocalStorage();
    this.tpsCalculate();
  }

  saveTvqToLocalStorage() {
    localStorage.setItem("tvq", JSON.stringify(this.tvq));
  }

  getTvq () {
    return this.tvqSubject.asObservable();
  }

  tpsCalculate () {
    this.tps = (this.subTotal * (this.tpsRate / 100)).toFixed(2);
    this.tpsSubject.next(parseFloat(this.tps));
    this.saveTpsToLocalStorage();
    this.totalCalculate();
  }

  saveTpsToLocalStorage() {
    localStorage.setItem("tps", JSON.stringify(this.tps));
  }

  getTps () {
    return this.tpsSubject.asObservable();
  }

  totalCalculate () {
    this.total = Number((this.subTotal + Number(this.tvq) + Number(this.tps) - this.couponTotal).toFixed(2));
    this.cartTotalSubject.next(this.total);
    this.saveTotalToLocalStorage();
    return this.total;
  }

  saveTotalToLocalStorage() {
    localStorage.setItem("total", JSON.stringify(this.total));
  }

  totalCaisseCalculate () {
    this.caisseTotalSubject.next(this.subTotalCaisse - this.caisseCouponTotal);
  }

  getCartTotal () {
    return this.cartTotalSubject.asObservable();
  }

  getCaisseTotal () {
    return this.caisseTotalSubject.asObservable();
  }

  couponCalculate () {
    this.couponTotal = 0;
    
    if (this.couponsSelected.length !== 0) {
      this.couponsSelected.forEach(selectedCoupon => {
        const coupon = this.coupons.find(c => c.name === selectedCoupon.name);

        if (coupon) {
          if (coupon.value != null) {
            this.couponTotal += Number(coupon.value);
          }
          if (coupon.rate != null) {
            this.couponTotal += parseFloat((this.subTotal * (coupon.rate / 100)).toFixed(2));
          }
        }
      });
    }
    
    this.couponsTotalSubject.next(this.couponTotal);
    this.totalCalculate();
  }

  caisseCouponCalculate () {
    this.caisseCouponTotal = 0;
    
    if (this.couponsSelected.length !== 0) {
      this.couponsSelected.forEach(selectedCoupon => {
        const coupon = this.coupons.find(c => c.name === selectedCoupon.name);

        if (coupon) {
          if (coupon.value != null) {
            this.caisseCouponTotal += Number(coupon.value);
          }
          if (coupon.rate != null) {
            this.caisseCouponTotal += parseFloat((this.subTotalCaisse * (coupon.rate / 100)).toFixed(2));
          }
        }
      });
    }
    
    this.couponsCaisseTotalSubject.next(this.caisseCouponTotal);
    this.totalCaisseCalculate();
  }

  getCouponTotal () {
    return this.couponsTotalSubject.asObservable();
  }

  getCouponCaisseTotal () {
    return this.couponsCaisseTotalSubject.asObservable();
  }

  getCoupons () {
    this.http.get<any>(
      `${environment.backendUrl}/api/coupons`
    ).subscribe((couponsFounded: any) => {
      if (couponsFounded.coupons != null && couponsFounded.coupons != undefined)
        this.coupons = couponsFounded.coupons;

      this.saveCouponsToLocalStorage();
      this.couponsSubject.next(this.coupons);
      return this.couponsSubject.asObservable();
    });
    this.saveCouponsToLocalStorage();
    return this.couponsSubject.asObservable();
  }

  saveCouponsToLocalStorage() {
    localStorage.setItem("coupons", JSON.stringify(this.coupons));
  }

  setAllCoupons () {
    this.couponsSelected = this.coupons;
  }

  cancelCoupons () {
    this.couponsSelected = [];
    this.couponCalculate();
  }

  setCoupon (couponToAdd: Coupon) {
    const index = this.couponsSelected.findIndex(coupon => coupon.name === couponToAdd.name);
    if (index === -1) {
      this.couponsSelected.push(couponToAdd);
    } else {
      this.couponsSelected.splice(index, 1);
    }
  }

  deliveryCalcultate () {
    //this.delivery = parseFloat((this.subTotal *  / 100).toFixed(2));
    this.deliverySubject.next(this.delivery);
  }

  getDelivery () {
    return this.deliverySubject.asObservable();
  }

  totalCheckout () {
    this.checkoutTotalSubject.next(this.total + this.delivery);
  }

  getCheckoutTotal () {
    this.totalCheckout();
    return this.checkoutTotalSubject.asObservable();
  }
}
