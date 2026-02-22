import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item } from '../../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsToDisplay: BehaviorSubject<Item[]>;
  private itemsInPromotions: BehaviorSubject<Item[]>;
  private bestItemsSold: BehaviorSubject<Item[]>;

  constructor(
    private http: HttpClient
  ) {
    this.itemsToDisplay = new BehaviorSubject<Item[]>([]);
    this.itemsInPromotions = new BehaviorSubject<Item[]>([]);
    this.bestItemsSold = new BehaviorSubject<Item[]>([]);
  }

  getActiveItems () {
    this.http.get<any>(
      `${environment.backendUrl}/api/items?active=true`
    ).subscribe((response: any) => {
      if (response.items != null && response.items != undefined)
        this.itemsToDisplay.next(response.items);
      return this.itemsToDisplay.asObservable();
    });
  }

  getAllItems () {
    this.http.get<any>(
      `${environment.backendUrl}/api/items`
    ).subscribe((response: any) => {
      if (response.items != null && response.items != undefined)
        this.itemsToDisplay.next(response.items);
      return this.itemsToDisplay.asObservable();
    });
  }

  getItems () {
    return this.itemsToDisplay.asObservable();
  }

  getItemById (id: number) : any {
    return this.http.get<any>(`${environment.backendUrl}/api/items/${id}`);
  }

  addItem (item: FormData) : any {
    return this.http.post<any>(
      `${environment.backendUrl}/api/items`,
      item
    );
  }

  deleteItem (id: number) {
    return this.http.patch<any>(
      `${environment.backendUrl}/api/items/${id}/delete`, {}
    );
  }

  updateItem (id: number, item: FormData) : any {
    return this.http.post<any>(
      `${environment.backendUrl}/api/items/${id}/edit`,
      item
    );
  }

  // getItemsToDisplay () {
  //   return this.itemsToDisplay.asObservable();
  // }

  getPromoItems (): Observable<Item[]> {
    return this.itemsToDisplay.pipe(
      switchMap((data) => {
        // Simulate an update operation and return the new data
        this.itemsInPromotions.next(data.filter((item: Item) => Number(item.promo) !== 0));
        return this.itemsInPromotions.asObservable();
      })
    );
  }

  getBestSellingItems (): Observable<Item[]> {
    return this.itemsToDisplay.pipe(
      switchMap((data) => {
        // Simulate an update operation and return the new data
        this.bestItemsSold.next((data.sort((a: Item, b: Item) => b.totalSell - a.totalSell)).slice(0, 10));
        return this.bestItemsSold.asObservable();
      })
    );
  }
  // getBestSellingItems (): Promise<Item[]> {
  //   return new Promise((resolve, reject) => {
  //     let bestSaled: Item[] = [];
  //     this.itemsToDisplay.subscribe((items: any) => {
  //       let tmp2: Item[] = items;
  //       bestSaled = tmp2.sort((a: Item, b: Item) => b.totalSell - a.totalSell);
  //       bestSaled = bestSaled.slice(0, 10);
  //       this.bestItemsSold.next(bestSaled);
  //       resolve(bestSaled);
  //     },
  //     error => reject(error)
  //     );
  //   });
  // }
}
