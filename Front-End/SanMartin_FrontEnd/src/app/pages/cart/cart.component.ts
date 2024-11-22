import { Component } from '@angular/core';
import { orderI } from '../../modelos/order.interface.js';
import { lineOrderI } from '../../modelos/lineOrder.interface.js';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { cartLineOrderI } from '../../modelos/cartLineOrder.interface.js';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgFor,
    NgIf
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  total:number = 0;

  cartLinesOrder:Array<cartLineOrderI> = [];

  constructor(private api:ApiService, private router:Router){ }

  getLinesOrder(){
    let orderId = "" + sessionStorage.getItem("orderId")
    if(orderId != null && orderId != ""){
      this.api.searchLinesOrderByOrderId(orderId).subscribe({
        next: (data) => {
          console.log("Mostrando la orden: " + orderId)
          for (let i = 0; i < data.data.length; i++){
            console.log("Orden:  ", data.data[i].order);
            this.api.searchProductById(data.data[i].product).subscribe({
              next: (p) => {
                let line:cartLineOrderI = {
                  id: data.data[i].id,
                  product: p.data,
                  quantity: data.data[i].quantity
                }
                this.cartLinesOrder.push(line)
                this.total = this.total + (p.data.priceUni * data.data[i].quantity);
              },
              error: (e) => {
                console.log(e)
              }
            })
          }
        },
        error: (e) => {
          console.log(e)
        }
      })
    }else{
      console.log("El orderId es nulo o vacio.")
    }
  }

  removeItem(line:cartLineOrderI){
    let lineId = "" + line.id;
    this.api.removeLineOrder(lineId).subscribe({
      next: (rl) => {
        console.log("Linea borrada exitosamente.")
      },
      error: (e) => {
        console.log(e)
      }
    })
    this.api.searchProductById(line.product.id).subscribe({
      next: (sp) => {
        console.log("Producto encontrado.")
        let prod = sp.data;
        prod.stock = prod.stock + line.quantity;
        this.api.updateProduct(prod).subscribe({
          next: (up) => {
            console.log("Stock actualizado.")
            location.reload()
          },
          error: (e) => {
            console.log(e)
          }
        })
      },
      error: (e) => {
        console.log(e)
      }
    })
    
  }

  redirectToComponent() {
    this.router.navigate(['/execute-purchase']);
  }

  ngOnInit(): void{
    this.getLinesOrder();
  }
}
