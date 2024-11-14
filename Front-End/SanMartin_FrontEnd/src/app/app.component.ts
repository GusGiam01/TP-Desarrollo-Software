import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SMHeaderComponent } from './sm-header/sm-header.component.js';
import { IndexSliderComponent } from './pages/index/index-slider/index-slider.component.js';
import { IndexVideoComponent } from './pages/index/index-video/index-video.component.js';
import { CommonModule } from '@angular/common';
import { PuntosventaListaComponent } from './pages/puntosventa/puntosventa-lista.component.js'
import { SmFooterComponent } from './sm-footer/sm-footer.component.js';
import { SmContactComponent } from './pages/contact/sm-contact.component.js';
import { routingComponents } from './app.routes.js';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AddressesComponent } from './pages/list-address/list-address.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    SMHeaderComponent,
    //IndexSliderComponent,
    //IndexVideoComponent,
    CommonModule,
    //PuntosventaListaComponent,
    SmFooterComponent,
    //SmContactComponent,
    //routingComponents,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SanMartin_FrontEnd';
  idPagina:number = 0;
}
