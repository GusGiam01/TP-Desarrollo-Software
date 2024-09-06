import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SMHeaderComponent } from './sm-header/sm-header.component.js';
import { IndexSliderComponent } from './index-slider/index-slider.component.js';
import { IndexVideoComponent } from './index-video/index-video.component.js';
import { CommonModule } from '@angular/common';
import { PuntosventaListaComponent } from './puntosventa-lista/puntosventa-lista.component.js'
import { SmFooterComponent } from './sm-footer/sm-footer.component.js';
import { SmContactComponent } from './sm-contact/sm-contact.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    SMHeaderComponent,
    IndexSliderComponent,
    IndexVideoComponent,
    CommonModule,
    PuntosventaListaComponent,
    SmFooterComponent,
    SmContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SanMartin_FrontEnd';
  idPagina:number = 0;
}
