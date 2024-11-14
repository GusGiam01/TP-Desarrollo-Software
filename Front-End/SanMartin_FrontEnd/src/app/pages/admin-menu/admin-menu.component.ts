import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [
      CommonModule,
      NgIf
  ],
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent {

  constructor(private api: ApiService, private router: Router) { }
  typeUser:string | null = localStorage.getItem("tipo");

  navigateTo() {
    this.router.navigate(['/add-product']);
  }

  navigateToOrders(){
    this.router.navigate(['/view-orders']);
  }

  navigateToModifyUser(){
    this.router.navigate(['/modify-user']);
  }

  logout(){
    localStorage.removeItem("token");
    this.router.navigate(['/']);
  }

  navigateToAddAddress(){
    this.router.navigate(['/list-address']);
  }
}

