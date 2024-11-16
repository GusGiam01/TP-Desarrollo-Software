import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { orderI } from '../../modelos/order.interface.js';
import { cartLineOrderI } from '../../modelos/cartLineOrder.interface.js';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { responseAddressesI } from '../../modelos/responseAddresses.interface.js';
import { addressI } from '../../modelos/address.interface.js';

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

  addresses: Array<addressI> = []; 

  shippingForm = new FormGroup({
    cardNumber: new FormControl('', Validators.required),
    expiryDate: new FormControl('', Validators.required),
    cvv: new FormControl('', Validators.required),
    cardholderName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required) 
  });

  cartLinesOrder: cartLineOrderI[] = [];
  order: orderI = {
    id: '',
    user: '',
    linesOrder: [],
    totalAmount: 0,
    statusHistory: '',
    address: {
      id: '',
      zipCode: '',
      province: '',
      nickname: '',
      address: '',
      user: ''
    }
  };

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getLinesOrder();
    this.loadUserAddresses();
    this.calculateOrderTotal();
  }

  getLinesOrder(): void {
    let orderId = "" + localStorage.getItem("orderId");
    this.api.searchLinesOrderByOrderId(orderId).subscribe({
      next: (data) => {
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

  loadUserAddresses(): void {
    this.api.searchAddressesByUserId("" + localStorage.getItem("token")).subscribe({
      next: (data) => {
        this.addresses = data.data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  calculateOrderTotal(): void {
    this.order.totalAmount = this.cartLinesOrder.reduce((acc, item) => acc + item.product.priceUni * item.quantity, 0);
  }

  submitPurchase(form: any): void {

    if (this.addresses.length === 0) {
      alert('Debe cargar al menos una dirección antes de efectuar la compra.');
      return;
    }

    let orderId = "" + localStorage.getItem("orderId");
    this.api.searchOrderById(orderId).subscribe({
      next: (data) => {
        let cardData = {
          cardNumber: form.cardNumber,
          expiryDate: form.expiryDate,
          cvv: form.cvv,
          cardholderName: form.cardholderName,
        };

        let completeOrder: orderI = {
          id: data.data.id,
          user: data.data.user,
          linesOrder: data.data.linesOrder,
          totalAmount: data.data.totalAmount,
          statusHistory: data.data.statusHistory,
          confirmDate: new Date(),
          address: form.address // Ajustado para usar el objeto address completo
        };

        this.api.updateOrder(completeOrder).subscribe({
          next: () => {
            localStorage.setItem("orderId", "");
            this.router.navigate(['/thanks']);
          },
          error: (e) => {
            console.log(e);
          }
        });
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
