import { Routes } from '@angular/router';
import { PuntosventaListaComponent } from './pages/puntosventa/puntosventa-lista.component.js';
import { SmContactComponent } from './pages/contact/sm-contact.component.js';
import { IndexComponent } from './pages/index/index.component.js';
import { LogInComponent } from './pages/log-in-sign-in/log-in.component.js';
import { CartComponent } from './pages/cart/cart.component.js';
import { ProductsComponent } from './pages/products/products.component.js';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'puntosVenta', component:PuntosventaListaComponent},
    {path:'home', component:IndexComponent},
    {path:'contact', component:SmContactComponent},
    {path:'login', component:LogInComponent},
    {path:'cart', component:CartComponent},
    {path:'products', component:ProductsComponent}
];

export const routingComponents = [PuntosventaListaComponent, IndexComponent, SmContactComponent, LogInComponent, CartComponent, ProductsComponent]