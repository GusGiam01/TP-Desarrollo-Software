import { Component } from '@angular/core';

@Component({
  selector: 'index-slider',
  standalone: true,
  imports: [],
  templateUrl: './index-slider.component.html',
  styleUrl: './index-slider.component.scss'
})

export class IndexSliderComponent {
  showSlider1 = true;
  showSlider2 = false;
  showSlider3 = false;
  showSlider4 = false;
  toggleClass = (el:HTMLElement, className:string) => el.classList.toggle(className);
  slidersLength = 4;  
  arrowNext = document.querySelector('#next');
  arrowBefore = document.querySelector('#before');
  value:any;

  changePosition(change:number){
    const currentElement = Number((document.querySelector('.slider_body-show') as HTMLElement).dataset['id']);
    this.value = currentElement;
    this.value += change;
    if( this.value === 0 || this.value == this.slidersLength+1){
        if (this.value === 0) this.value = this.slidersLength;
        if (this.value == this.slidersLength+1) this.value = 1;
    }

    switch (this.value){
      case 1:{
        this.showSlider1 = true;
        this.showSlider2 = false;
        this.showSlider4 = false;
        break
      }
      case 2:{
        this.showSlider2 = true;
        this.showSlider1 = false;
        this.showSlider3 = false;
        break
      }
      case 3:{
        this.showSlider3 = true;
        this.showSlider2 = false;
        this.showSlider4 = false;
        break
      }
      case 4:{
        this.showSlider4 = true;
        this.showSlider1 = false;
        this.showSlider3 = false;
        break
      }
    }

}
}
