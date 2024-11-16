import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { productI } from '../../modelos/product.interface.js';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { orderI } from '../../modelos/order.interface.js';
import { responseOrderI } from '../../modelos/responseOrder.interface.js';
import { addOrderI } from '../../modelos/addOrder.interface.js';
import { lineOrderI } from '../../modelos/lineOrder.interface.js';
import { Token } from '@angular/compiler';
import { orderPatchI } from '../../modelos/orderPatch.interface';
import { addressI } from '../../modelos/address.interface.js';

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
  quantity: number = 1;
  maxQuantity: number = 0;
  productCode: string = "";

  selectProduct(code: string, stock: number) {
    this.productCode = code;
    this.quantity = 1;
    this.maxQuantity = stock;
  }

  increase() {
    if (this.quantity < this.maxQuantity) {
      this.quantity++
    }
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity--
    }
    else {
      if (this.quantity == 1) {
        this.productCode = "";
      }
    }
  }

  products: Array<productI> = [];

  constructor(private api: ApiService, private router: Router) { }

  getProducts() {
    this.api.searchProducts().subscribe({
      next: (data) => {
        this.products = data.data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  createLineOrder(p: string, q: number, o: string): lineOrderI {
    let line: lineOrderI = {
      product: p,
      quantity: q,
      order: o
    }
    console.log(line)
    this.api.postLineOrder(line).subscribe({
      next: (data) => {
        console.log("line order: " + data.data.id + " creada exitosamente.")
      },
      error: (e) => {
        console.log(e)
      }
    })
    return line
  }

  addToOrder(o: orderI, line: lineOrderI): void {
    this.api.searchProductById(line.product).subscribe({
      next: (productResponse) => {
        const product = productResponse.data;

        this.api.searchLinesOrderByOrderId(o.id).subscribe({
          next: (data) => {
            const updatedLines = [...data.data, line];
            const updatedOrder: orderPatchI = {
              //...o,
              id: o.id,
              linesOrder: updatedLines,
              totalAmount: o.totalAmount + line.quantity * product.priceUni
            };
            this.api.patchOrder(updatedOrder).subscribe({
              next: () => {
                console.log("Orden actualizada exitosamente.");
              },
              error: (e) => {
                console.error("Error al actualizar la orden:", e);
              }
            });
          },
          error: (e) => {
            console.error("Error al obtener líneas de la orden:", e);
          }
        });
      },
      error: (e) => {
        console.error("Error al obtener detalles del producto:", e);
      }
    });
  }

  addToCart(id: string, q: number) {
    this.api.searchProductById(id).subscribe({
      next: (prod) => {
        const selectedProduct = prod.data;
        if (selectedProduct.stock >= q) {
          const userId = "" + localStorage.getItem("token");
  
          // Recuperar ID de orden de localStorage, si existe
          let existingOrderId = localStorage.getItem("orderId");
  
          this.api.searchOrders().subscribe({
            next: (os) => {
              const orders = os.data;
  
              // Buscar orden UNPAID del usuario
              let order: orderI | null = null;
              for (let j = 0; j < orders.length; j++) {
                if (
                  orders[j].statusHistory === "UNPAID" &&
                  orders[j].user === userId
                ) {
                  order = orders[j]; // Actualizar la variable "order"
                  break; // Detener el bucle al encontrar la orden
                }
              }
  
              // Si ya existe la orden, agregar la línea
              if (order) {
                const newLine = this.createLineOrder(selectedProduct.id, q, order.id);
                this.addToOrder(order, newLine);
              }
              // Si no existe la orden, crear una nueva
              else if (existingOrderId) {
                console.log("Usando orden existente de localStorage:", existingOrderId);
                this.api.searchOrderById(existingOrderId).subscribe({
                  next: (response) => {
                    const storedOrder = response.data;
                    const newLine = this.createLineOrder(selectedProduct.id, q, storedOrder.id);
                    this.addToOrder(storedOrder, newLine);
                  },
                  error: (e) => {
                    console.error("Error al recuperar la orden desde localStorage:", e);
                  },
                });
              } else {
                const newLine: lineOrderI = { product: selectedProduct.id, quantity: q };
                const newOrder: addOrderI = {
                  statusHistory: "UNPAID",
                  linesOrder: [newLine],
                  totalAmount: selectedProduct.priceUni * q,
                  user: userId,
                };
  
                this.api.postOrder(newOrder).subscribe({
                  next: (response) => {
                    localStorage.setItem("orderId", response.data.id);
                    console.log("Orden creada exitosamente.");
                  },
                  error: (e) => {
                    console.error("Error al crear la orden:", e);
                  },
                });
              }
            },
            error: (e) => {
              console.error("Error al buscar órdenes:", e);
            },
          });
        } else {
          alert("No hay suficiente stock.");
        }
      },
      error: (e) => {
        console.error("Error al buscar el producto:", e);
        alert("No se encontró el producto.");
      },
    });
  
    this.productCode = "";
  }
  


  ngOnInit(): void{
    this.getProducts();
  }

  onSortChange(event: any): void {
    const sortBy = event.target.value;

    this.api.searchProducts().subscribe({
      next: (data) => {
        this.products = data.data;

        if (sortBy === 'alphabetical') {
          this.products = [...this.products].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'priceAsc') {
          this.products = [...this.products].sort((a, b) => a.priceUni - b.priceUni);
        }
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

}
