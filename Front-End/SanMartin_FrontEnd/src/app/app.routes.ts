import { Routes } from '@angular/router';
import { PuntosventaListaComponent } from './pages/puntosventa/puntosventa-lista.component.js';
import { SmContactComponent } from './pages/contact/sm-contact.component.js';
import { IndexComponent } from './pages/index/index.component.js';
import { LogInComponent } from './pages/log-in-sign-in/log-in.component.js';
import { CartComponent } from './pages/cart/cart.component.js';
import { ProductsComponent } from './pages/products/products.component.js';
import { AboutUsComponent } from './pages/about-us/about-us.component.js';
import { ExecutePurchaseComponent } from './pages/execute-purchase/execute-purchase.component.js';
import { ThanksForBuyingComponent } from './pages/thanks-for-buying/thanks-for-buying.component.js';
import { AdminMenuComponent } from './pages/admin-menu/admin-menu.component.js';
import { AddProductComponent } from './pages/add-product/add-product.component.js';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'puntosVenta', component:PuntosventaListaComponent},
    {path:'home', component:IndexComponent},
    {path:'contact', component:SmContactComponent},
    {path:'login', component:LogInComponent},
    {path:'cart', component:CartComponent},
    {path:'products', component:ProductsComponent},
    {path:'about-us', component:AboutUsComponent},
    {path:'execute-purchase', component:ExecutePurchaseComponent},
    {path:'thanks', component:ThanksForBuyingComponent},
    {path:'admin-menu', component:AdminMenuComponent},
    {path:'add-product', component:AddProductComponent}
];

export const routingComponents = [PuntosventaListaComponent, IndexComponent, SmContactComponent, LogInComponent, CartComponent, 
    ProductsComponent, AboutUsComponent, ExecutePurchaseComponent, ThanksForBuyingComponent, AdminMenuComponent, AddProductComponent]