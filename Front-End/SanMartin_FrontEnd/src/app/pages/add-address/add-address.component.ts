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

  ngOnInit(){
    let userId = "" + localStorage.getItem("token");
    this.api.searchAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data.data
        console.log("Se encontraron todas las direcciones del usuario: " + userId)
      },
      error: (e) => {
        console.log(e);
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
    if (this.addressForm.valid) {
      this.address = this.addressForm.value;
      this.address.user = ""+localStorage.getItem("token");
      let check = this.checkAddress(this.address, this.addresses)
      if (check == ""){ 
        this.api.postAddress(this.address).subscribe({
          next: () => {
            this.api.searchAddressesByUserId(this.address.user).subscribe({
              next: (userAddresses) => {
                const addresses = userAddresses.data;
                const getAddress = addresses.filter(address => address.nickname === this.address.nickname);
                this.api.searchUserById(getAddress[0].user).subscribe({
                  next: (datauser) => {
                    const user = datauser.data
                    let transformo : string = getAddress[0].id ?? "";
                    user.addresses?.push(transformo);
                    this.api.updateUser(user).subscribe({
                      next: (updateuser) => {
                        console.log("Direccion con id: " + getAddress[0].id + " añadida al usuario: " + updateuser.data)
                      },
                      error: (e) => {
                        console.log(e);
                      }
                    })
                  },
                  error: (e) => {
                    console.log(e)
                  }
                })
              },
              error: (e) => {

              }
            })
            this.router.navigate(['/list-address']);
          },
          error: (error) => {
            console.error('Error al guardar la dirección:', error)
          }
        });
      }
      else {
        if (check == "NICKNAME") {
          alert("Ya existe una dirección registrada con el nickname: " + this.address.nickname)
        }
        else {
          alert("Ya existe una dirección registrada en "+this.address.address+", "+this.address.zipCode)
        }
      }
    }
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
    if(nickname && /^[a-zA-Z0-9ñ]+$/.test(nickname)){
      return false;
    }else{
      return true;
    }
  }

  validateAddress():boolean{
    let address = "" + this.addressForm.get("address")?.value;
    if(address && /^[a-zA-Z0-9ñ]+$/.test(address)){
      return false;
    }else{
      return true;
    }
  }

  validateProvince():boolean{
    let province = "" + this.addressForm.get("province")?.value;
    if(province && /^[a-zA-Zñ]+$/.test(province)){
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
