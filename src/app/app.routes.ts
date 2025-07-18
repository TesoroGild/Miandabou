import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { ItemsPage } from './pages/item/items.page';
import { CartPage } from './pages/cart/cart.page';
import { CheckoutPage } from './pages/checkout/checkout.page';
import { LoginPage } from './pages/login/login.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { RegisterPage } from './pages/register/register.page';
import { NotFoundPage } from './pages/not-found/not-found.page';

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
        component: CartPage
    },
    {
        path: 'checkout',
        component: CheckoutPage
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
        path: 'login',
        component: LoginPage
    },
    {
        path: 'notfound',
        component: NotFoundPage
    },
    {
        path: 'register',
        component: RegisterPage
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