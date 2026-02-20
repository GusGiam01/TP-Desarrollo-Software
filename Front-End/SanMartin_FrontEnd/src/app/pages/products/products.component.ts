import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { productI } from '../../modelos/product.interface.js';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { orderI } from '../../modelos/order.interface.js';
import { responseOrderI } from '../../modelos/responseOrder.interface.js';
import { addOrderI } from '../../modelos/addOrder.interface.js';
import { addLineOrderI } from '../../modelos/addLineOrder.interface.js';
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

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

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
    this.errorMessage = null;
    this.isLoading = true;

    this.api.searchProducts().subscribe({
      next: (data) => {
        this.products = data.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "No se pudieron cargar los productos.";
        console.log("hola")
      }
    });
  }

  createLineOrder(productId: string, quantity: number, orderId: string) {
    const line: addLineOrderI = {
      product: productId,
      quantity: quantity,
      order: orderId
    };

    return this.api.postLineOrder(line);
  }

  addToOrder(orderId: string, product: productI, quantity: number) {
    return new Promise<void>((resolve, reject) => {

      this.api.searchOrderById(orderId).subscribe({
        next: (go) => {

          const order = go.data;

          this.createLineOrder(product.id, quantity, orderId).subscribe({
            next: () => {

              order.totalAmount += product.priceUni * quantity;

              this.api.updateOrder(order).subscribe({
                next: () => resolve(),
                error: () => reject("No se pudo actualizar la orden.")
              });

            },
            error: () => reject("No se pudo crear la línea de orden.")
          });

        },
        error: () => reject("No se encontró la orden.")
      });

    });
  }


addToCart(id: string, quantity: number) {

    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    const userId = sessionStorage.getItem("token");

    if (!userId) {
      this.errorMessage = "Debe iniciar sesión para comprar.";
      this.isLoading = false;
      return;
    }

    this.api.searchProductById(id).subscribe({
      next: (prod) => {

        const selectedProduct = prod.data;

        if (selectedProduct.stock < quantity) {
          this.errorMessage = "No hay suficiente stock disponible.";
          this.isLoading = false;
          return;
        }

        let orderId = sessionStorage.getItem("orderId");


        if (!orderId) {

          const newOrder: addOrderI = {
            statusHistory: "UNPAID",
            linesOrder: [],
            totalAmount: 0,
            user: userId
          };

          this.api.postOrder(newOrder).subscribe({
            next: (co) => {

              orderId = co.data.id;
              sessionStorage.setItem("orderId", orderId);

              this.processAddToExistingOrder(orderId, selectedProduct, quantity);

            },
            error: () => {
              this.errorMessage = "No se pudo crear la orden.";
              this.isLoading = false;
            }
          });

        } else {

          this.processAddToExistingOrder(orderId, selectedProduct, quantity);

        }

      },
      error: () => {
        this.errorMessage = "No se encontró el producto.";
        this.isLoading = false;
      }
    });
  }

  processAddToExistingOrder(orderId: string, product: productI, quantity: number) {
    this.addToOrder(orderId, product, quantity)
      .then(() => {

        product.stock -= quantity;

        this.api.updateProduct(product).subscribe({
          next: () => {

            this.successMessage = "Producto agregado al carrito.";
            this.productCode = "";
            this.isLoading = false;

          },
          error: () => {
            this.errorMessage = "No se pudo actualizar el stock.";
            this.isLoading = false;
          }
        });

      })
      .catch((errorMsg) => {
        this.errorMessage = errorMsg;
        this.isLoading = false;
      });
  }

  


  ngOnInit(): void{
    this.getProducts();
  }

  onSortChange(event: any): void {
    const sortBy = event.target.value;

    if (sortBy === 'alphabetical') {
      this.products = [...this.products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (sortBy === 'priceAsc') {
      this.products = [...this.products].sort((a, b) =>
        a.priceUni - b.priceUni
      );
    }
  }


}
