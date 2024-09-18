import { Component } from '@angular/core';

@Component({
  selector: 'app-sm-product',
  templateUrl: './sm-product.component.html',
  styleUrls: ['./sm-product.component.css']
})
export class SmProductComponent {
  productos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del producto 2', precio: 150 },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del producto 3', precio: 200 }
  ];
}
