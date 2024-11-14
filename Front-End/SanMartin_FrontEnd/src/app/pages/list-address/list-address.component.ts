import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service';
import { Router } from '@angular/router';
import { userI } from '../../modelos/user.interface';

@Component({
  selector: 'app-addresses',
  templateUrl: './list-address.component.html',
  styleUrls: ['./list-address.component.scss']
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getAddresses();
  }

  // Obtiene las direcciones del usuario desde el servicio
  getAddresses(): void {
    let userId = "" + localStorage.getItem("token");
    this.api.getUserAddresses(userId).subscribe({
      next: (data) => {
        this.addresses = data.data;
      },
      error: (error) => {
        console.error('Error al obtener las direcciones:', error);
      }
    });
  }
  
  deleteAddress(addressId: string) {
    let userId = "" + localStorage.getItem("token");
    this.api.getUserAddresses(userId).subscribe({
      next: (data) => {
        this.addresses = data.data;
        const updatedAddresses = this.addresses.filter(address => address.id !== addressId);
        const updatedUser : userI = { 
          ...data, 
          addresses: updatedAddresses  // Actualizamos específicamente la propiedad 'addresses'
        };
        this.api.updateUser(updatedUser).subscribe({
          next: () => {
            console.log("Dirección eliminada correctamente.");
            this.api.removeAddress(addressId).subscribe({
              next: () => {
                console.log("Dirección eliminada de la base de datos.");
                this.router.navigate([this.router.url]);
              },
              error: (error) => {
                console.error('Error al eliminar la dirección de la base de datos:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al actualizar el usuario:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener las direcciones:', error);
      }
    });
  }  

  addAddress(): void {
    this.router.navigate(['/add-address']);
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }
}
