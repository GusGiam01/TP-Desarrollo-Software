import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';

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
  products: Array<string> = ["sn", "sn","sn", "sn","sn", "sn" ,"sn", "sn","sn", "sn","sn", "sn"];


}
