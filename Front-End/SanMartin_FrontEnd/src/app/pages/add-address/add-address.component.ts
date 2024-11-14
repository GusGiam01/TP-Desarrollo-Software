import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { addAddressI } from '../../modelos/addAddress.interface';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule 
  ],
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent {
  addressForm: FormGroup;

  address: addAddressI = {
    zipCode: '',
    nickName: '',
    address: '',
    province: ''
  };

  constructor(private router: Router, private api: ApiService, private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      zipCode: ['', Validators.required],
      nickname: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.address = this.addressForm.value;
      this.api.postAddress(this.address).subscribe({
        next: () => this.router.navigate(['/addresses']),
        error: (error) => console.error('Error al guardar la dirección:', error)
      });
    }
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
}
