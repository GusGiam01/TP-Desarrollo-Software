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

  errorMessage: string | null = null;
  isLoading = false;

  cartLinesOrder:Array<cartLineOrderI> = [];

  constructor(private api:ApiService, private router:Router){ }

  getLinesOrder() {

    const orderId = sessionStorage.getItem("orderId");

    if (!orderId) {
      this.errorMessage = "No hay una orden activa.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.cartLinesOrder = [];
    this.total = 0;

    this.api.searchLinesOrderByOrderId(orderId).subscribe({
      next: (data) => {

        if (!data?.data || data.data.length === 0) {
          this.isLoading = false;
          return;
        }

        for (let i = 0; i < data.data.length; i++) {

          this.api.searchProductById(data.data[i].product).subscribe({
            next: (p) => {

              const line: cartLineOrderI = {
                id: data.data[i].id,
                product: p.data,
                quantity: data.data[i].quantity
              };

              this.cartLinesOrder.push(line);
              this.total += (p.data.priceUni * data.data[i].quantity);

              if (i === data.data.length - 1) {
                this.isLoading = false;
              }
            },
            error: () => {
              this.errorMessage = "Error al cargar productos del carrito.";
              this.isLoading = false;
            }
          });
        }
      },
      error: () => {
        this.errorMessage = "No se pudieron cargar las líneas del pedido.";
        this.isLoading = false;
      }
    });
  }


  removeItem(line: cartLineOrderI) {

    this.isLoading = true;
    this.errorMessage = null;

    const lineId = "" + line.id;

    this.api.removeLineOrder(lineId).subscribe({
      next: () => {

        this.api.searchProductById(line.product.id).subscribe({
          next: (sp) => {

            const prod = sp.data;
            prod.stock = prod.stock + line.quantity;

            this.api.updateProduct(prod).subscribe({
              next: () => {
                this.cartLinesOrder = this.cartLinesOrder.filter(l => l.id !== line.id);
                this.total -= (line.product.priceUni * line.quantity);

                this.isLoading = false;
              },
              error: () => {
                this.errorMessage = "No se pudo actualizar el stock.";
                this.isLoading = false;
              }
            });

          },
          error: () => {
            this.errorMessage = "No se pudo recuperar el producto.";
            this.isLoading = false;
          }
        });

      },
      error: () => {
        this.errorMessage = "No se pudo eliminar la línea del carrito.";
        this.isLoading = false;
      }
    });
  }


  redirectToComponent() {
    this.router.navigate(['/execute-purchase']);
  }

  ngOnInit(): void{
    this.getLinesOrder();
  }
}
