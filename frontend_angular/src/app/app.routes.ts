import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { ItemsPage } from './pages/items/items.page';
import { CartPage } from './pages/cart/cart.page';
import { CheckoutPage } from './pages/checkout/checkout.page';
import { LoginPage } from './pages/login/login.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { RegisterPage } from './pages/register/register.page';
import { NotFoundPage } from './pages/not-found/not-found.page';
//import { BillsPage } from './pages/bills/bills.page';
import { ItemDetailsPage } from './pages/items/item-details/item-details.page';
import { StockPage } from './pages/stock/stock.page';
import { authGuard } from './auth-guard';
import { adminGuard, commisGuard } from './admin-guard';

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
        path: 'bills',
        canMatch: [authGuard],
        loadComponent: () => import('./pages/bills/bills.page').then(m => m.BillsPage)
    },
    {
        path: 'cart',
        component: CartPage
    },
    {
        path: 'checkout',
        canMatch: [authGuard],
        loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage)
    },
    {
        path: 'contact',
        component: ContactPage
    },
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'items',
        component: ItemsPage
    },
    {
        path: 'items/:name',
        component: ItemDetailsPage
    },
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'register',
        component: RegisterPage
    },
    {
        path: 'stock',
        canMatch: [commisGuard],
        loadComponent: () => import('./pages/stock/stock.page').then(m => m.StockPage)
    },
    {
        path: 'notfound',
        component: NotFoundPage
    },
    {
        path: '**',
        redirectTo: 'notfound',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}