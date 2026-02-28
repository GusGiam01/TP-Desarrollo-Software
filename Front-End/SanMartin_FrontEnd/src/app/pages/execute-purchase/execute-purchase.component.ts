import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../servicios/api/api.service.js';
import { orderI } from '../../modelos/order.interface.js';
import { cartLineOrderI } from '../../modelos/cartLineOrder.interface.js';
import { addressI } from '../../modelos/address.interface.js';

@Component({
  selector: 'app-execute-purchase',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './execute-purchase.component.html',
  styleUrls: ['./execute-purchase.component.scss'],
})
export class ExecutePurchaseComponent implements OnInit {
  addresses: Array<addressI> = [];

  shippingForm = new FormGroup({
    address: new FormControl('', Validators.required),
  });

  cartLinesOrder: cartLineOrderI[] = [];

  order: orderI = {
    id: '',
    user: '',
    linesOrder: [],
    totalAmount: 0,
    statusHistory: [],
    address: {
      id: '',
      zipCode: '',
      province: '',
      nickname: '',
      address: '',
      user: '',
    },
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getLinesOrder();
    this.loadUserAddresses();
  }

  getLinesOrder(): void {
    const orderId = localStorage.getItem("orderId");

    this.cartLinesOrder = [];
    this.order.totalAmount = 0;

    if (!orderId) return;

    this.api.searchLinesOrderByOrderId(orderId).subscribe({
      next: (data) => {
        for (let i = 0; i < data.data.length; i++) {
          this.api.searchProductById(data.data[i].product).subscribe({
            next: (p) => {
              const line: cartLineOrderI = {
                id: data.data[i].id,
                product: p.data,
                quantity: data.data[i].quantity,
                orderId,
              };

              this.cartLinesOrder.push(line);
              this.order.totalAmount += p.data.priceUni * data.data[i].quantity;
            },
            error: (e) => console.log(e),
          });
        }
      },
      error: (e) => console.log(e),
    });
  }

  loadUserAddresses(): void {
    const userId = localStorage.getItem("token");
    if (!userId) {
      console.log("No se encontró el userId en localStorage.");
      return;
    }
    this.api.searchAddressesByUserId(userId).subscribe({
      next: (data) => {
        this.addresses = data.data;
      },
      error: (e) => console.log(e),
    });
  }

  pagarConMercadoPago(): void {
    if (this.addresses.length === 0) {
      alert('Debe cargar al menos una dirección antes de efectuar la compra.');
      return;
    }

    const orderId = localStorage.getItem('orderId');
    const selectedAddressId = this.shippingForm.get('address')?.value;

    if (!orderId || orderId === 'null') {
      alert('No hay una orden válida para pagar.');
      return;
    }

    if (!selectedAddressId) {
      alert('Seleccioná una dirección.');
      return;
    }

    this.api.searchOrderById(orderId).subscribe({
      next: (data) => {
        const prev = Array.isArray(data.data.statusHistory) ? data.data.statusHistory : [];
        this.api.patchOrder({
          id: orderId,
          confirmDate: new Date(),
          address: selectedAddressId as any,
          statusHistory: [...prev, "PENDING_PAYMENT"],
        }).subscribe({
          next: () => {
            this.api.createMercadoPagoPreference(orderId).subscribe({
              next: (r) => window.location.href = r.initPoint,
              error: (err) => {
                console.log(err);
                alert("No se pudo iniciar el pago con Mercado Pago.");
              }
            });
          },
          error: (err) => console.log(err),
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
