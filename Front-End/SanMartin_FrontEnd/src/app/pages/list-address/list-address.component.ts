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

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getAddresses();
  }

 
  getAddresses(): void {
    let userId = "" + sessionStorage.getItem("token");
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
    if (this.addresses.length > 1){
      console.log(addressId)
      let userId = "" + sessionStorage.getItem("token");
      const updatedAddresses = this.addresses.filter(address => address.id !== addressId);
      const addressesIds:Array<string> = [];
      for (let j = 0; j < updatedAddresses.length; j++){
        addressesIds.push(updatedAddresses[j].id)
      }
      this.api.searchUserById(userId).subscribe({
        next: (data1) => {
          const updatedUser  = data1.data;
          updatedUser.addresses = addressesIds
          console.log(updatedUser);
          this.api.updateUser(updatedUser).subscribe({
            next: (uu) => {
              console.log(uu.data);
              console.log("Dirección eliminada correctamente.");
              this.api.removeAddress(addressId).subscribe({
                next: () => {
                  console.log("Dirección eliminada de la base de datos.");
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
          
          location.reload();
        },
        error: (s) => {
          console.error('Error al eliminar la dirección de la base de datos:', s);
        }
      })
    }
    else {
      alert("No se puede borrar tu unica dirección, debes agregar otra antes.")
    }                    
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
