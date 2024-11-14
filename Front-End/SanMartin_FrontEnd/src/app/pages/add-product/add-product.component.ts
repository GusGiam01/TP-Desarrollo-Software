import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { addProductI } from '../../modelos/addProduct.interface.js';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})

export class AddProductComponent implements OnInit {
  
  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void { }

  addProductForm = new FormGroup({
    code: new FormControl('', Validators.required),
    priceUni: new FormControl<number | null>(null, Validators.required),
    name: new FormControl('', Validators.required),
    stock: new FormControl<number | null>(null, Validators.required),
    state: new FormControl('Habilitado', Validators.required),
    discount: new FormControl(0, Validators.required),
    type: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    img: new FormControl('', Validators.required),
  });

  addProduct() {
    const formValues = this.addProductForm.value;
    const newProduct: addProductI = {
      code: formValues.code ?? '',
      priceUni: formValues.priceUni ?? 0,
      name: formValues.name ?? '',
      stock: formValues.stock ?? 0,
      state: formValues.state ?? 'Habilitado',
      discount: formValues.discount ?? 0,
      type: formValues.type ?? '',
      brand: formValues.brand ?? '',
      img: formValues.img ?? ''
    };

    this.api.postProduct(newProduct).subscribe({
      next: () => {
        this.router.navigate(['home']).then(() => location.reload());
      },
      error: (e) => {
        console.log({ newProduct });
        console.log(e);
      }
    });
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }
}
