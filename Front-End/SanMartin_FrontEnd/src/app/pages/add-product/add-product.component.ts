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

  errorMessage: string | null = null;
  isLoading = false;

  addProductForm = new FormGroup({
    code: new FormControl('', Validators.required),
    priceUni: new FormControl<number | null>(null, Validators.required),
    name: new FormControl('', Validators.required),
    stock: new FormControl<number | null>(null, Validators.required),
    state: new FormControl('Habilitado', Validators.required),
    discount: new FormControl(0, Validators.required),
    type: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
  });

  addProduct() {
    if (this.addProductForm.invalid) return;
    this.errorMessage = null;
    this.isLoading = true;
    const formValues = this.addProductForm.value;

    const newProduct: addProductI = {
      code: formValues.code ?? '',
      priceUni: formValues.priceUni ?? 0,
      name: formValues.name ?? '',
      stock: formValues.stock ?? 0,
      state: formValues.state ?? 'Habilitado',
      discount: formValues.discount ?? 0,
      type: formValues.type ?? '',
      brand: formValues.brand ?? ''
    };

    this.api.postProduct(newProduct).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['home']);
      },
      error: (e) => {
        this.isLoading = false;

        if (e.status === 400) {
          this.errorMessage = e.error?.message || "Datos inválidos.";
        } else if (e.status === 409) {
          this.errorMessage = "Ya existe un producto con ese código.";
        } else if (e.status === 500) {
          this.errorMessage = "Error interno del servidor.";
        } else {
          this.errorMessage = "No se pudo agregar el producto.";
        }
      }
    });
}


  validateCode():boolean{
    let code = "" + this.addProductForm.get("code")?.value;
    if(code && /^[a-zA-Z]{2}[0-9]{4}$/.test(code)){
      return false;
    }else{
      return true;
    }
  }

  validatePriceUni():boolean{
    let priceUni = this.addProductForm.get("priceUni")?.value;
    if(priceUni != null && priceUni != undefined){
      return false;
    }else{
      return true;
    }
  }

  validateName():boolean{
    let name = "" + this.addProductForm.get("name")?.value;
    if(/^[a-zA-Z0-9ñ\s]+$/.test(name)){
      return false;
    }else{
      return true;
    }
  }

  validateStock():boolean{
    let stock = this.addProductForm.get("stock")?.value;
    if(stock != null && stock != undefined){
      return false;
    }else{
      return true;
    }
  }

  validateType():boolean{
    let type = "" + this.addProductForm.get("type")?.value;
    if(/^[a-zA-Zñ\s]+$/.test(type)){
      return false;
    }else{
      return true;
    }
  }

  validateBrand():boolean{
    let brand = "" + this.addProductForm.get("brand")?.value;
    if(/^[a-zA-Z0-9ñ\s]+$/.test(brand)){
      return false;
    }else{
      return true;
    }
  }

  validateForm():boolean{
    return (
      this.validateBrand() || 
      this.validateCode() || 
      this.validateName() || 
      this.validatePriceUni() || 
      this.validateStock() ||
      this.validateType()
    )
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }
}
