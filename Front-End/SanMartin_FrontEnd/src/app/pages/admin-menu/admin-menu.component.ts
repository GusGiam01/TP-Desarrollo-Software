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
  errorMessage: string | null = null;
  isLoading = false;
  ngOnInit(): void {
    const token = sessionStorage.getItem("token");

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.getUser();
  }

  getUser() {
    const id = sessionStorage.getItem("token");

    this.isLoading = true;
    this.errorMessage = null;

    if (!id) {
      this.router.navigate(['/login']);
      return;
    }

    this.api.searchUserById(id).subscribe({
      next: (data) => {

        if (!data?.data) {
          this.errorMessage = "Usuario inválido.";
          this.isLoading = false;
          return;
        }

        this.userType = data.data.type;
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        this.errorMessage = "No se pudo cargar la información del usuario.";
      }
    });
  }


  navigateTo() {
    this.router.navigate(['/add-product']);
  }

  navigateToOrders(){
    this.router.navigate(['/view-orders']);
  }

  navigateToModifyUser(){
    this.router.navigate(['/view-user-data']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  navigateToAddAddress(){
    this.router.navigate(['/list-address']);
  }
}

