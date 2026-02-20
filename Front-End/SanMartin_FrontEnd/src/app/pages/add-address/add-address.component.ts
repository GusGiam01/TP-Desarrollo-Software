import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { addAddressI } from '../../modelos/addAddress.interface';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { addressI } from '../../modelos/address.interface.js';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf
  ],
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  addressForm: FormGroup;

  addresses:Array<addressI> = [];

  address: addAddressI = {
    zipCode: '',
    nickname: '',
    address: '',
    province: '',
    user: ''
  };

  errorMessageLoad: string | null = null;
  errorMessageSubmit: string | null = null;
  isLoading = false; 

  ngOnInit(){
    let userId = "" + sessionStorage.getItem("token");
    this.api.searchAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data.data
        console.log("Se encontraron todas las direcciones del usuario: " + userId)
      },
      error: (e) => {
        this.errorMessageLoad = "No se pudieron cargar las direcciones.";
      }
    })
  }

  constructor(private router: Router, private api: ApiService, private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      zipCode: ['', Validators.required],
      nickname: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required]
    });
  }

  checkAddress(address:addAddressI, list:Array<addressI>):string{
    let check = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].nickname == address.nickname){
        check = "NICKNAME"
      }
      if (list[i].address == address.address && list[i].zipCode == address.zipCode) {
        check = "DIRECCIÓN"
        break
      }
    }
    return check
  }

  onSubmit() {
    if (!this.addressForm.valid) {
      return;
    }

    this.errorMessageSubmit = null;
    this.isLoading = true;

    this.address = this.addressForm.value;
    this.address.user = "" + sessionStorage.getItem("token");

    const check = this.checkAddress(this.address, this.addresses);

    if (check !== "") {
      this.isLoading = false;

      if (check === "NICKNAME") {
        this.errorMessageSubmit = "Ya existe una dirección con ese nickname.";
      } else {
        this.errorMessageSubmit =
          "Ya existe una dirección registrada en " +
          this.address.address +
          ", " +
          this.address.zipCode;
      }

      return;
    }

    this.api.postAddress(this.address).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/list-address']);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400) {
          this.errorMessageSubmit =
            error.error?.message || "Datos inválidos.";
        } else if (error.status === 404) {
          this.errorMessageSubmit = "Usuario no encontrado.";
        } else if (error.status === 500) {
          this.errorMessageSubmit = "Error interno del servidor.";
        } else {
          this.errorMessageSubmit = "No se pudo guardar la dirección.";
        }
      }
    });
  }

  validateZipCode():boolean{
    let zipCode = "" + this.addressForm.get("zipCode")?.value;
    if(zipCode && /^[0-9]+$/.test(zipCode) && zipCode.length == 4){
      return false;
    }else{
      return true;
    }
  }

  validateNickname():boolean{
    let nickname = "" + this.addressForm.get("nickname")?.value;
    if(nickname && /^[a-zA-Z0-9ñ\s]+$/.test(nickname)){
      return false;
    }else{
      return true;
    }
  }

  validateAddress():boolean{
    let address = "" + this.addressForm.get("address")?.value;
    if(address && /^[a-zA-Z0-9ñ\s]+$/.test(address)){
      return false;
    }else{
      return true;
    }
  }

  validateProvince():boolean{
    let province = "" + this.addressForm.get("province")?.value;
    if(province && /^[a-zA-Zñ\s]+$/.test(province)){
      return false;
    }else{
      return true;
    }
  }

  validateForm():boolean{
    return (
      this.validateAddress() ||
      this.validateNickname() ||
      this.validateProvince() ||
      this.validateZipCode()
    )
  }

  onCancel() {
    this.router.navigate(['/admin-menu']);
  }
}
