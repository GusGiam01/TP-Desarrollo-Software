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

  userType = "";

  ngOnInit():void{
    this.getUser();
  }

  getUser(): void {
    const id = localStorage.getItem('token'); // string | null

    if (!id) {
      console.error('No hay "token" en localStorage (id inexistente).');
      return;
    }

    this.api.searchUserById(id).subscribe({
      next: (res: any) => {
        this.userType = res?.data?.type ?? null;
      },
      error: (e) => console.error(e),
    });
  }

  navigateTo_addProduct() {
    this.router.navigate(['/add-product']);
  }

  navigateTo_seePaudOrders() {
    this.router.navigate(['/paid-orders']);
  }

  navigateToOrders(){
    this.router.navigate(['/view-orders']);
  }

  navigateToModifyUser(){
    this.router.navigate(['/view-user-data']);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("orderId");
    this.router.navigate(['home']).then(() => {
      location.reload()
    });
  }

  navigateToAddAddress(){
    this.router.navigate(['/list-address']);
  }
}

