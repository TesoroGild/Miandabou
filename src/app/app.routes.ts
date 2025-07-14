import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Item } from './components/item/item';
import { Cart } from './components/cart/cart';

export const routes: Routes = [
    {
        path: '/',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'cart',
        component: Cart,
    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'item',
        component: Item,
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}