import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/dev.environment';
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

  getItems () {
    this.http.get<any>(
      `${environment.backendUrl}/api/items`
    ).subscribe((response: any) => {
      if (response.items != null && response.items != undefined)
        this.itemsToDisplay.next(response.items);
      return this.itemsToDisplay.asObservable();
    });
  }

  getAllItems () {
    return this.itemsToDisplay.asObservable();
  }

  addItem (item: FormData) : any {
    return this.http.post<any>(
      `${environment.backendUrl}/api/items`,
      item
    )
  }

  // setItemsToDisplay (items: Item[]) {
    
  // }

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
  // getPromoItems (): Promise<Item[]> {
  //   return new Promise((resolve, reject) => {
  //     let promos: Item[] = [];
  //     this.itemsToDisplay.subscribe((items: any) => {
  //       let tmp1: Item[] = items;
  //       promos = tmp1.filter((item: Item) => Number(item.promo) !== 0);
  //       this.itemsInPromotions.next(promos);
  //       resolve(promos);
  //     },
  //     error => reject(error)
  //     )
  //   });
  // }

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

  // getData(queryUrl: string,para:any={}) {
  //   let getUrl: string = this.baseUrl + queryUrl;
  //   return this.http.get<any>(getUrl,{params:para});
  // }

  // postDataProd(formAction:string, formData: FormData) {
  //   let postUrl:string = this.baseUrl + formAction;
  //   this.http.post<any>(postUrl, formData).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if (res.msg == "Ajout!") {
  //         this.snackBar.open("Produit ajouté!", "", {
  //           duration: 3000,
  //           horizontalPosition: 'right',
  //           verticalPosition: 'top',
  //           panelClass: 'popup'
  //         });
  //       } else if (res.msg == "Modification!!!") {
  //         this.snackBar.open("Produit Mis à Jour!!!", "", {
  //           duration: 3000,
  //           horizontalPosition: 'right',
  //           verticalPosition: 'bottom',
  //           panelClass: 'popup'
  //         });
  //       }
  //     },
  //     error:(err) => {
  //       console.log(err);
  //       this.snackBar.open("Une erreur est survenue lors de l'ajout!!!", "", {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         panelClass: 'popup3'
  //       });
  //     },
  //     complete: () => console.info('complete')
  //   });
  // }
}
