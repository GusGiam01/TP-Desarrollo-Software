import { Component } from '@angular/core';
import { IndexSliderComponent } from './index-slider/index-slider.component.js';
import { IndexVideoComponent } from './index-video/index-video.component.js';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    IndexSliderComponent,
    IndexVideoComponent
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

}
