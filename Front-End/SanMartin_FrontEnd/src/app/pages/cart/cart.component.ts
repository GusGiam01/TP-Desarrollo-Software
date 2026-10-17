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
    this.cartLinesOrder = [];
    this.total = 0;
    const orderId = localStorage.getItem("orderId");
    if (!orderId) return;
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
                  quantity: data.data[i].quantity,
                  orderId: orderId
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

  removeItem(line: cartLineOrderI) {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) return;

    const lineId = String(line.id);

    this.api.removeLineOrder(lineId).subscribe({
      next: () => {
        this.cartLinesOrder = this.cartLinesOrder.filter(l => l.id !== line.id);
        this.total = Math.max(0, this.total - (line.product.priceUni * line.quantity));

        this.api.searchProductById(line.product.id).subscribe({
          next: (sp) => {
            const prod = sp.data;
            prod.stock += line.quantity;
            this.api.updateProduct(prod).subscribe();
          }
        });

        if (this.cartLinesOrder.length === 0) {
          this.api.deleteOrder(orderId).subscribe({
            next: () => {
              localStorage.removeItem("orderId");
              this.total = 0;
              this.cartLinesOrder = [];
            },
          });
          return;
        }

        this.api.patchOrder({ id: orderId, totalAmount: this.total }).subscribe();
      },
      error: (e) => console.log(e),
    });
  }

  redirectToComponent() {
    this.router.navigate(['/execute-purchase']);
  }

  ngOnInit(): void{
    this.getLinesOrder();
  }
}
