import { Routes } from '@angular/router';
import { PuntosventaListaComponent } from './puntosventa-lista/puntosventa-lista.component.js';
import { IndexSliderComponent } from './index-slider/index-slider.component.js';
import { IndexVideoComponent } from './index-video/index-video.component.js';
import { SmContactComponent } from './sm-contact/sm-contact.component.js';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'puntosVenta', component:PuntosventaListaComponent},
    {path:'home', component:IndexSliderComponent},
    {path:'home', component:IndexVideoComponent},
    {path:'contact', component:SmContactComponent}
];

export const routingComponent = [PuntosventaListaComponent, IndexSliderComponent, IndexVideoComponent, SmContactComponent]