import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service';
import { Router } from '@angular/router';
import { userI } from '../../modelos/user.interface';
import { NgFor, NgIf } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgFor
  ],
  selector: 'app-addresses',
  templateUrl: './list-address.component.html',
  styleUrls: ['./list-address.component.scss'],
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];

  errorMessage: string | null = null;
  isLoading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getAddresses();
  }

 
  getAddresses(): void {
    const userId = sessionStorage.getItem("token");

    if (!userId) {
      this.errorMessage = "No hay sesión activa.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.addresses = [];

    this.api.searchAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "No se pudieron cargar las direcciones.";
        this.isLoading = false;
      }
    });
  }

  
  deleteAddress(addressId: string) {
    if (this.addresses.length <= 1) {
      this.errorMessage = "No se puede borrar tu única dirección. Agrega otra antes.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.api.removeAddress(addressId).subscribe({
      next: () => {
        // Actualizamos lista local
        this.addresses = this.addresses.filter(a => a.id !== addressId);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "No se pudo eliminar la dirección.";
        this.isLoading = false;
      }
    });
  }
  
  
  addAddress(): void {
    this.router.navigate(['/add-address']);
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }

  sortAddresses(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value;
  
    if (sortBy === 'nickname') {
      this.addresses.sort((a, b) => a.nickname.localeCompare(b.nickname));
    } else if (sortBy === 'address') {
      this.addresses.sort((a, b) => a.address.localeCompare(b.address));
    }
  }  
}
