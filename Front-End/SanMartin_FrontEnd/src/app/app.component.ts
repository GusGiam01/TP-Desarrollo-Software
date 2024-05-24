import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SMHeaderComponent } from './sm-header/sm-header.component.js';
import { IndexSliderComponent } from './index-slider/index-slider.component.js';
import { IndexVideoComponent } from './index-video/index-video.component.js';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    SMHeaderComponent,
    IndexSliderComponent,
    IndexVideoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SanMartin_FrontEnd';
}
