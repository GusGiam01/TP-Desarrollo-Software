import { Routes } from '@angular/router';
import { PuntosventaListaComponent } from './pages/puntosventa/puntosventa-lista.component.js';
import { SmContactComponent } from './pages/contact/sm-contact.component.js';
import { IndexComponent } from './pages/index/index.component.js';
import { LogInComponent } from './pages/log-in/log-in.component.js';
import { CreateAccountComponent } from './pages/create-account/create-account.component.js';
import { CartComponent } from './pages/cart/cart.component.js';
import { ProductsComponent } from './pages/products/products.component.js';
import { AboutUsComponent } from './pages/about-us/about-us.component.js';
import { ExecutePurchaseComponent } from './pages/execute-purchase/execute-purchase.component.js';
import { ThanksForBuyingComponent } from './pages/thanks-for-buying/thanks-for-buying.component.js';
import { AdminMenuComponent } from './pages/admin-menu/admin-menu.component.js';
import { AddProductComponent } from './pages/add-product/add-product.component.js';
import { ViewOrdersComponent } from './pages/view-orders/view-orders.component.js';
import { EditUserComponent } from './pages/modifyuser/modifyuser.component.js';
import { AddAddressComponent } from './pages/add-address/add-address.component.js';
import { AddressesComponent } from './pages/list-address/list-address.component.js';
import { ViewUserDataComponent } from './pages/view-user-data/view-user-data.component.js';
import { SendUsMailComponent } from './pages/send-us-mail/send-us-mail.component.js';
import { ViewSingleOrderComponent } from './pages/view-single-order/view-single-order.component.js';
import { OrderStatusComponent } from './pages/order-status/order-status.component.js';


export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'puntosVenta', component:PuntosventaListaComponent},
    {path:'home', component:IndexComponent},
    {path:'contact', component:SmContactComponent},
    {path:'login', component:LogInComponent},
    {path:'signin', component:CreateAccountComponent},
    {path:'cart', component:CartComponent},
    {path:'products', component:ProductsComponent},
    {path:'about-us', component:AboutUsComponent},
    {path:'execute-purchase', component:ExecutePurchaseComponent},
    {path:'thanks', component:ThanksForBuyingComponent},
    {path:'admin-menu', component:AdminMenuComponent},
    {path:'add-product', component:AddProductComponent},
    {path:'view-orders', component:ViewOrdersComponent},
    {path:'modify-user', component:EditUserComponent},
    {path:'add-address', component:AddAddressComponent},
    {path:'list-address', component:AddressesComponent},
    {path:'view-user-data', component:ViewUserDataComponent},
    {path:'send-us-an-email', component:SendUsMailComponent },
    {path:'order-status', component:OrderStatusComponent },
    {path:'order-detail', component:ViewSingleOrderComponent}
];

export const routingComponents = [PuntosventaListaComponent, IndexComponent, SmContactComponent, LogInComponent, CreateAccountComponent, CartComponent, EditUserComponent, AddAddressComponent,
    ProductsComponent, AboutUsComponent, ExecutePurchaseComponent, ThanksForBuyingComponent, AdminMenuComponent, AddProductComponent, AddressesComponent, ViewOrdersComponent,
    ViewUserDataComponent, OrderStatusComponent, ViewSingleOrderComponent]