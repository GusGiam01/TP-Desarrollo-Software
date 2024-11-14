import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { orderI } from '../../modelos/order.interface.js';
import { cartLineOrderI } from '../../modelos/cartLineOrder.interface.js';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-execute-purchase',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './execute-purchase.component.html',
  styleUrls: ['./execute-purchase.component.scss']
})

export class ExecutePurchaseComponent implements OnInit {

  shippingForm = new FormGroup({
    address : new FormControl('', Validators.required),
    city : new FormControl('', Validators.required),
    zipCode : new FormControl('', Validators.required),
    cardNumber : new FormControl('', Validators.required),
    expiryDate: new FormControl('', Validators.required),
    cvv : new FormControl('', Validators.required),
    order : new FormControl('', Validators.required),
    cardholderName : new FormControl('', Validators.required),
  })
  
  cartLinesOrder: cartLineOrderI[] = [];

  order: orderI = {
    id: '',
    user: '',
    linesOrder: [],
    totalAmount: 0,
    statusHistory: ''
  };

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getLinesOrder();
    this.calculateOrderTotal();
  }

  getLinesOrder(){                                            // Podria pasarla a servicio y llamarla de Cart y Execute-purchase a ahi
    let orderId = "" + localStorage.getItem("orderId")
    this.api.searchLinesOrderByOrderId(orderId).subscribe({
      next: (data) => {                                       //Condicion de si ya se efectuo la compra que no aparezca la orden aca.
        for (let i = 0; i < data.data.length; i++){
          this.api.searchProductById(data.data[i].product).subscribe({
            next: (p) => {
              let line:cartLineOrderI = {
                id: data.data[i].id,
                product: p.data,
                quantity: data.data[i].quantity
              }
              this.cartLinesOrder.push(line)
              this.order.totalAmount = this.order.totalAmount + (p.data.priceUni * data.data[i].quantity);
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
  }

  calculateOrderTotal(): void {
    this.order.totalAmount = this.cartLinesOrder.reduce((acc, item) => acc + item.product.priceUni * item.quantity, 0);
  }

  submitPurchase(form:any): void {
    let orderId = "" + localStorage.getItem("orderId");
    this.api.searchOrderById(orderId).subscribe({
      next: (data) => {
        let cardData = {
          cardNumber: form.cardNumber,
          expiryDate: form.expiryDate,
          cvv: form.cvv,
          cardholderName: form.cardholderName,
        }

        let completeOrder: orderI = {
          id: data.data.id, 
          user: data.data.user, 
          linesOrder: data.data.linesOrder, 
          totalAmount: data.data.totalAmount, 
          statusHistory: data.data.statusHistory,
          address: form.address,
          zipCode: form.zipCode,
          province: form.province 
        };
        localStorage.setItem("orderId", "");
        this.router.navigate(['/thanks']);
      },
      error: (e) => {
        console.log(e)
      }
    })    
  }
}
