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
    ngOnInit(): void {
      this.getLinesOrder(() => {
        this.showOrder();
      });
    }

  order: orderI = {} as orderI;
  addressRecuperado: addressI = {} as addressI;
  cartLinesOrder: cartLineOrderI[] = [];

  constructor(private api: ApiService, private router: Router) { }

  showOrder(): void {
    let orderId = "" + sessionStorage.getItem("orderId");
    this.api.searchOrderById(orderId).subscribe({
      next: (data) => {
        this.order.id = data.data.id;
        this.order.confirmDate = data.data.confirmDate;
        this.order.statusHistory = data.data.statusHistory;
        this.order.totalAmount = data.data.totalAmount;
        if (data.data.address) {
          this.loadAddress(data.data.address);
        } else {
          console.log("No hay data sobre la dirección.");
        }

      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  loadAddress(address: addressI): void {
    let addressId = "" + address;
    if (address) {
      this.api.searchAddressById(addressId).subscribe({
        next: (data) => {
          console.log(data);
          this.addressRecuperado.id = data.data.id;
          this.addressRecuperado.address = data.data.address;
          this.addressRecuperado.nickname = data.data.nickname;
          this.addressRecuperado.province = data.data.province;
          this.addressRecuperado.zipCode = data.data.zipCode;
        },
        error: (e) => {
          console.log(e)
        }
      })
    } else {
      console.error('Address ID is undefined');
    }
  }
    getLinesOrder(callback: () => void): void {
      let orderId = "" + sessionStorage.getItem("orderId");
      this.api.searchLinesOrderByOrderId(orderId).subscribe({
        next: (data) => {
          this.order.totalAmount = 0;
    
          const productRequests = data.data.map((line: lineOrderI) =>
            this.api.searchProductById(line.product).pipe(
              map((productData) => ({
                line,
                product: productData.data
              })),
              catchError((error) => {
                console.error(`Error fetching product ${line.product}:`, error);
                return of(null);
              })
            )
          );
    
          forkJoin(productRequests).pipe(
            finalize(() => {
              console.log('All product requests completed');
            })
          ).subscribe({
            next: (results) => {
              results.forEach((result) => {
                if (result) {
                  const line: cartLineOrderI = {
                    id: result.line.id,
                    product: result.product,
                    quantity: result.line.quantity
                  };
                  this.cartLinesOrder.push(line);
                  this.order.totalAmount += result.product.priceUni * result.line.quantity;
                }
              });
              callback();
            },
            error: (q) => {
              console.error("Error in product requests:", q);
            }
          });
        },
        error: (e) => {
          console.error("Error fetching lines:", e);
        }
      });
    }
    

  goBack() {
    this.router.navigate(['/view-orders']);
  }
}
