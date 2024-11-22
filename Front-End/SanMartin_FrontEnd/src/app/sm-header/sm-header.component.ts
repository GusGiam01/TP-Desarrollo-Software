import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'sm-header',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
  ],
  templateUrl: './sm-header.component.html',
  styleUrl: './sm-header.component.scss'
})
export class SMHeaderComponent {
  isActive = false;

  options = [
    {name: "Iniciar sesión", value: '/login'},
    {name: "Productos", value: '/products'},
    {name: "Carrito", value: '/cart'},
    {name: "¿Dónde encontrarnos?", value: '/puntosVenta'},
    {name: "Contactanos", value: '/contact'},
    {name: "¿Quiénes somos?", value: '/about-us'},
    
  ]

  constructor (private router:Router) {}

  pageId?: number;
  @Output() pageIdChange = new EventEmitter<number>();
  
  emitPageId(){
    this.pageIdChange.emit(this.pageId)
  }

  loggedUser:string | null = localStorage.getItem("token");
  ngOnInit():void{
    this.loggedUser = localStorage.getItem("token");
    if (this.loggedUser != null && this.loggedUser != "") {
      this.options[0] = {
        name: "Cuenta",
        value: "/admin-menu"
      }
    }
  }

  logOut(){
    localStorage.removeItem("token");
    localStorage.removeItem("orderId");
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

  toggleActive(){
    this.isActive = !this.isActive
  }

  redirectToComponent(link:string) {
    this.router.navigate([link]);
    this.isActive = !this.isActive
  }
}

