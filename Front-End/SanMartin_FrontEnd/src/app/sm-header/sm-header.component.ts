import { Component, EventEmitter, HostListener, Output } from '@angular/core';

import { NgxHideOnScrollModule } from 'ngx-hide-on-scroll';

@Component({
  selector: 'sm-header',
  standalone: true,
  imports: [],
  templateUrl: './sm-header.component.html',
  styleUrl: './sm-header.component.scss'
})
export class SMHeaderComponent {
  pageId?: number;
  @Output() pageIdChange = new EventEmitter<number>();
  
  emitPageId(){
    this.pageIdChange.emit(this.pageId)
  }

  // showMenu(){
  //   const currentScrollpos:number= window.scrollY;
  //   alert(currentScrollpos);
  //   const element = document.getElementById("bottom_menu");
  //   if (currentScrollpos < this.prevScrollpos) {
  //     if (element != null) element.style.top = "0";
  //   } else {
  //     if (element != null){
  //     element.style.top = "-50px";
  //     }
  //   }
  //   this.prevScrollpos = currentScrollpos;
  // }

  showMenu:string = 'bot-2';
  prevScrollpos = window.scrollY;
  @HostListener('window:scroll', ['$event']) onScroll(){
    const currentScrollpos:number= window.scrollY;
    const element = document.getElementById("bottom_menu");
    if (currentScrollpos < this.prevScrollpos) {
      if (element != null) {
        element.style.marginTop = "0px";

      }
    } else {
      if (element != null){
      element.style.marginTop = "-54px";

      }
    }
    this.prevScrollpos = currentScrollpos;
  }
}

