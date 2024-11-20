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
  /*
    ngOnInit(): void {
      this.getLinesOrder();
      this.showOrder();
    }
  */

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
    let orderId = "" + localStorage.getItem("orderId");
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
  /*
    getNameProduct(productId: string): string {
      let nombreProduct: string = "";
      this.api.searchProductById(productId).subscribe({
        next: (data) => {
          nombreProduct = data.data.name;
        }
      })
      return nombreProduct;
    }
  
    getPriceProduct(productId: string): number {
      let nombreProduct: number = 0;
      this.api.searchProductById(productId).subscribe({
        next: (data) => {
          nombreProduct = data.data.priceUni;
        }
      })
      return nombreProduct;
    }
  */
  loadAddress(address: addressI): void {
    console.log("Id de address:", address);
    console.log("Id de address en order:", this.order.address);
    let addressId = "" + address;
    console.log("Id de addressId:", address);
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
  /*
    getLinesOrder(): void {
      let orderId = "" + localStorage.getItem("orderId");
      this.api.searchLinesOrderByOrderId(orderId).subscribe({
        next: (data) => {
          this.order.totalAmount = 0;
          for (let i = 0; i < data.data.length; i++) {
            this.api.searchProductById(data.data[i].product).subscribe({
              next: (p) => {
                let line: cartLineOrderI = {
                  id: data.data[i].id,
                  product: p.data,
                  quantity: data.data[i].quantity
                };
                this.cartLinesOrder.push(line);
                this.order.totalAmount = this.order.totalAmount + (p.data.priceUni * data.data[i].quantity);
              },
              error: (e) => {
                console.log(e);
              }
            });
          }
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  */

    getLinesOrder(callback: () => void): void {
    console.log("Entroooooooooooooooooooo al getLinesOrder");
      let orderId = "" + localStorage.getItem("orderId");
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
              callback(); // Llama al callback al finalizar
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
