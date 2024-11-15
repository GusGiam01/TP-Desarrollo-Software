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
  quantity:number = 1;
  maxQuantity:number = 0;
  productCode:string = "";

  selectProduct(code:string, stock:number){
    this.productCode = code;
    this.quantity = 1;
    this.maxQuantity = stock;
  }

  increase(){
    if (this.quantity < this.maxQuantity){
      this.quantity++
    }
  }

  decrease(){
    if (this.quantity > 1){
      this.quantity--
    } 
    else{
      if (this.quantity == 1){
        this.productCode = "";
      }
    }
  }

  products: Array<productI> = [];

  constructor(private api:ApiService, private router:Router){ }

  getProducts(){
    this.api.searchProducts().subscribe({
      next: (data) => {
        this.products = data.data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  createLineOrder(p:string, q:number, o:string):lineOrderI{
    let line:lineOrderI = {
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

  addToOrder(o:orderI, line:lineOrderI):orderI{
    let order:orderI = {
      id: o.id,
      linesOrder: [],
      totalAmount: o.totalAmount,
      statusHistory: o.statusHistory,
      user: o.user
    };
    this.api.searchLinesOrderByOrderId(order.id).subscribe({
      next: (data) => {
        for (let i = 0; i < data.data.length; i++){
          order.linesOrder.push(data.data[i]);
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
    return order
  }

  addToCart(id:string, q:number){   
    this.api.searchProductById(id).subscribe({
      next: (prod) => {
        const selectedProduct = prod.data;
        if (selectedProduct.stock >= q){
          if (localStorage.getItem("orderId") == null) {
            let userId = "" + localStorage.getItem("token");
            let order:addOrderI = {
              statusHistory: "UNPAID",
              linesOrder: [],
              totalAmount: 0,
              user: userId
            }
            let line:lineOrderI = {
              product:selectedProduct.id, 
              quantity: q
            }
            order.linesOrder.push(line);
            order.totalAmount = selectedProduct.priceUni * q;
            this.api.postOrder(order).subscribe({
              next: (co) => {
                let dataResponseOrder:responseOrderI = co;
                localStorage.setItem("orderId", dataResponseOrder.data.id);
                console.log("Se creo la orden.")
                selectedProduct.stock = selectedProduct.stock - q;
                this.api.updateProduct(selectedProduct).subscribe({
                  next: (pp) => {
                    console.log("stock modificado.")
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
          else {
            let orderId = ""+localStorage.getItem("orderId")
            this.api.searchOrderById(orderId).subscribe({
              next: (go) => {
                let order = this.addToOrder(go.data, this.createLineOrder(selectedProduct.id, q, orderId));
                order.totalAmount = order.totalAmount + (selectedProduct.priceUni * q)
                this.api.updateOrder(order).subscribe({
                  next: (uo) => {
                    console.log("Se agrego el objeto al pedido.")
                    selectedProduct.stock = selectedProduct.stock - q;
                  this.api.updateProduct(selectedProduct).subscribe({
                    next: (pp) => {
                      console.log("stock modificado.")
                    },
                    error: (e) => {
                      console.log(e)
                    }
                  })
                  },
                  error: (e) =>
                    alert("Hubo un problema al agregar un articulo a su carrito.")
                })

              },
              error: (e) => {
                console.log(e);
                alert("No se encontro la orden")
              }
            })
          }
        } 
        else {
          alert("No hay suficiente stock.")
        }
      },
      error: (e) => {
        console.log(e);
        alert("No se encontro el objeto")
      }
    })
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
