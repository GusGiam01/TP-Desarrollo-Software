import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { orderI } from '../../modelos/order.interface.js';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [
    CommonModule, 
    NgIf, 
    NgFor
  ],
  templateUrl: './view-single-order.component.html',
  styleUrl: './view-single-order.component.scss'
})
export class ViewSingleOrderComponent {

  ngOnInit() : void{
    this.mostrarOrder();
  }

  order: orderI = {} as orderI;

  constructor(private api: ApiService, private router: Router) { }

  mostrarOrder() : void {
    let orderId = "" + localStorage.getItem("OrderId");
    this.api.searchOrderById(orderId).subscribe({
      next: (data) => {
        this.order = data.data;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getNameProduct(productId:string) : string{
    let nombreProduct : string = "";
    this.api.searchProductById(productId).subscribe({
      next: (data) => {
        nombreProduct = data.data.name;
      }
    })
    return nombreProduct;
  }

  getPriceProduct(productId:string) : number{
    let nombreProduct : number = 0;
    this.api.searchProductById(productId).subscribe({
      next: (data) => {
        nombreProduct = data.data.priceUni;
      } 
    })
    return nombreProduct;
  }

  goBack(){
    this.router.navigate(['/']);
  }
}
