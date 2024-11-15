import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service';
import { Router } from '@angular/router';
import { userI } from '../../modelos/user.interface';
import { NgFor, NgIf } from '@angular/common';

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

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getAddresses();
  }

  // Obtiene las direcciones del usuario desde el servicio
  getAddresses(): void {
    let userId = "" + localStorage.getItem("token");
    this.api.searchAddressesByUserId(userId).subscribe({
      next: (data) => {
        for (let i = 0; i < data.data.length; i++ ){
          this.addresses.push(data.data[i]);
        }
      },
      error: (error) => {
        console.error('Error al obtener las direcciones:', error);
      }
    });
  }
  
  deleteAddress(addressId: string) {
    let userId = "" + localStorage.getItem("token");
    this.api.searchAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data.data;
        const updatedAddresses = this.addresses.filter(address => address.id !== addressId);
        this.api.searchUserById(userId).subscribe({
          next: (data1) => {
            const updatedUser : userI = {
              id: data1.data.id,
              name: data1.data.name,
              surname: data1.data.surname,
              password: data1.data.password,
              type: data1.data.type,
              mail: data1.data.mail, 
              cellphone: data1.data.cellphone, 
              birthDate: data1.data.birthDate, 
              dni: data1.data.dni, 
              addresses: updatedAddresses
            };

            this.api.updateUser(updatedUser).subscribe({
              next: () => {
                console.log("Dirección eliminada correctamente.");
                this.api.removeAddress(addressId).subscribe({
                  next: () => {
                    console.log("Dirección eliminada de la base de datos.");
                    this.router.navigate([this.router.url]);
                  },
                  error: (t) => {
                    console.error('Error al eliminar la dirección de la base de datos:', t);
                  }
                });
              },
              error: (r) => {
                console.error('Error al actualizar el usuario:', r);
              }
            });
          },
          error: (s) => {
            console.error('Error al eliminar la dirección de la base de datos:', s);
          }
        })
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
