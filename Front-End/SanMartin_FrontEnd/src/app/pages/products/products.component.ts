import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { productI } from '../../modelos/product.interface.js';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NgFor,
    NgIf
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: Array<productI> = [];

  constructor(private api:ApiService, private router:Router){ }

  getProducts(){
    this.api.searchProducts().subscribe({
      next: (data) => {
        this.products = data.data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  addToCart(code:string, cantidad:number){   
    this.api.searchProductByCode(code).subscribe({
      next: (data) => {
        let product = data.data;
        if (product.stock > cantidad){ alert ("hola")}
      },
      error: (e) => {
        console.log(e);
        alert("No se encontro el objeto")
      }
    })
  }

  ngOnInit(): void{
    this.getProducts();
  }

}
