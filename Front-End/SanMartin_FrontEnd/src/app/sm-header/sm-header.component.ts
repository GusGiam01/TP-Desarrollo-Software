import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'sm-header',
  standalone: true,
  imports: [
    CommonModule,
    NgIf
  ],
  templateUrl: './sm-header.component.html',
  styleUrl: './sm-header.component.scss'
})
export class SMHeaderComponent {
  pageId?: number;
  @Output() pageIdChange = new EventEmitter<number>();
  
  emitPageId(){
    this.pageIdChange.emit(this.pageId)
  }

  loggedUser:string | null = localStorage.getItem("token");

  ngOnInit():void{
    this.loggedUser = localStorage.getItem("token");
  }

  logOut(){
    localStorage.removeItem("token");
    this.loggedUser = null;
    location.reload();
  }

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

