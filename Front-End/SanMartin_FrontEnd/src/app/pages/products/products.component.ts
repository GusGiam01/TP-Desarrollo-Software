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
    if (this.quantity = 1){
      this.productCode = "";
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

  createLineOrder(p:string, q:number):lineOrderI{
    let line:lineOrderI = {
      product: p,
      quantity: q
    }
    return line
  }

  addToCart(code:string, q:number){   
    this.api.searchProductByCode(code).subscribe({
      next: (prod) => {
        const selectedProduct = prod.data;
        if (selectedProduct.stock >= q){
          if (localStorage.getItem("orderId") == null) {
            let dni = ""+localStorage.getItem("dni"); 
            this.api.searchByDni(dni).subscribe({
              next: (u) => {
                let thisUser = u.data;
                let order:addOrderI = {
                  confirmDate: new Date(),
                  statusHistory: "",
                  linesOrder: [],
                  totalAmount: 0,
                  user: thisUser
                }
                let line = this.createLineOrder(selectedProduct., q);
                order.linesOrder.push(line);
                for (let i=0; i < order.linesOrder.length; i++){
                  order.totalAmount = order.totalAmount + (order.linesOrder[i].product.priceUni * order.linesOrder[i].quantity) 
                }
                this.api.postOrder(order).subscribe({
                  next: (co) => {
                    let dataResponseOrder:responseOrderI = co;
                    localStorage.setItem("orderId", dataResponseOrder.data.id);
                    console.log("Se creo la orden.")
                  }
                })
              },
              error: (e) => {
                console.log(e);
              }
            })

            
          }
          else {
            let orderId = ""+localStorage.getItem("orderId")
            this.api.searchOrderById(orderId).subscribe({
              next: (go) => {
                let order = go.data;
                let line = this.createLineOrder(selectedProduct, q);
                order.linesOrder.push(line);
                for (let i=0; i < order.linesOrder.length; i++){
                  order.totalAmount = order.totalAmount + (order.linesOrder[i].product.priceUni * order.linesOrder[i].quantity) 
                }
                this.api.updateOrder(order).subscribe({
                  next: (uo) => {
                    console.log("Se agrego el objeto al pedido.")
                  },
                  error: (e) =>
                    alert("Hubo un problema al agregar un articulo a su carrito.")
                })

              },
              error: (e) => {
                console.log(e);
                alert("No se encontro el objeto")
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
  }

  ngOnInit(): void{
    this.getProducts();
  }

}
