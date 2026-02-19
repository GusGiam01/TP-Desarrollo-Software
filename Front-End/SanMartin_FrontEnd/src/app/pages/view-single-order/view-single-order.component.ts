import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { orderI } from '../../modelos/order.interface.js';
import { lineOrderI } from '../../modelos/lineOrder.interface.js';
import { addressI } from '../../modelos/address.interface.js';
import { cartLineOrderI } from '../../modelos/cartLineOrder.interface.js';
import { CommonModule, NgIf, NgFor } from '@angular/common';

import { forkJoin, of } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';

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
  
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const orderId = sessionStorage.getItem("orderId");

    if (!orderId) {
      this.router.navigate(['/view-orders']);
      return;
    }

    this.loadOrder(orderId);
  }

  

  order: orderI = {} as orderI;
  addressRecuperado: addressI = {} as addressI;
  cartLinesOrder: cartLineOrderI[] = [];

  constructor(private api: ApiService, private router: Router) { }

  loadOrder(orderId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cartLinesOrder = [];

    this.api.searchOrderById(orderId).subscribe({
      next: (orderData) => {

        this.order = orderData.data;

        if (this.order.address) {
          this.loadAddress(this.order.address);
        }

        this.loadLines(orderId);
      },
      error: () => {
        this.errorMessage = "No se pudo cargar la orden.";
        this.isLoading = false;
      }
    });
  }

  loadAddress(addressId: string): void {
      this.api.searchAddressById(addressId).subscribe({
      next: (data) => {
        this.addressRecuperado = data.data;
      },
      error: () => {
        this.errorMessage = "No se pudo cargar la dirección.";
      }
    });
  }
  loadLines(orderId: string): void {
    this.api.searchLinesOrderByOrderId(orderId).subscribe({
      next: (data) => {

        const productRequests = data.data.map((line: lineOrderI) =>
          this.api.searchProductById(line.product).pipe(
            map(productData => ({
              id: line.id,
              product: productData.data,
              quantity: line.quantity
            }))
          )
        );

        forkJoin(productRequests).subscribe({
          next: (results) => {
            this.cartLinesOrder = results;
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = "Error cargando los productos.";
            this.isLoading = false;
          }
        });

      },
      error: () => {
        this.errorMessage = "Error cargando las líneas.";
        this.isLoading = false;
      }
    });
  }

    

  goBack() {
    this.router.navigate(['/view-orders']);
  }
}
