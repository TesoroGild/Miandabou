import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Item } from './pages/item/item';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Login } from './pages/login/login';
import { AboutPage } from './pages/about/about.page';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'about',
        component: AboutPage
    },
    {
        path: 'cart',
        component: Cart,
    },
    {
        path: 'contact',
        component: Contact
    },
    {
        path: 'checkout',
        component: Checkout
    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'item',
        component: Item,
    },
    {
        path: 'login',
        component: Login
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}