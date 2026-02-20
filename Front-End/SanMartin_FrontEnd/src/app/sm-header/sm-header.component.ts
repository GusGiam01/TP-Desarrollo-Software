import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service.js';


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

  isLogged = false;

  constructor (private router:Router, private authService:AuthService) {}

  pageId?: number;
  @Output() pageIdChange = new EventEmitter<number>();
  
  emitPageId(){
    this.pageIdChange.emit(this.pageId)
  }

  loggedUser:string | null = sessionStorage.getItem("token");

  ngOnInit():void{
    this.authService.isLogged$.subscribe(status => {
      this.isLogged = status;
    });
  }

  logOut(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("orderId");
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

