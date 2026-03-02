import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { orderI } from '../../modelos/order.interface.js';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [
    CommonModule, 
    NgIf, 
    NgFor
  ],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent {

  ngOnInit(): void {
    this.getOrders();
  }

  constructor(private api: ApiService, private router: Router) { }

  odersOfUser: orderI[] = [];

  getOrders() {
  const userId = String(localStorage.getItem("token"));
  console.log("Usuario: ", userId);

  this.api.searchOrdersByUser(userId).subscribe({
    next: (res) => {
      for (let i = 0; i < res.data.length; i++) {
        const order = res.data[i];
        const lastStatus = order.statusHistory?.[order.statusHistory.length - 1];

        if (lastStatus !== "UNPAID" && lastStatus !== "CANCELLED") {
          this.odersOfUser.push(order);
        }
      }
    },
    error: (e) => console.log(e),
  });
}

  viewOrderDetails(orderId: any) {
    localStorage.setItem("orderId", orderId);
    this.router.navigate(['/order-detail']);
  }

  goBack() {
    this.router.navigate(['/admin-menu']);
  }

  sortOrders(event: any) {
    const sortValue = event.target.value;
    if (sortValue === 'date') {
      this.odersOfUser.sort((a, b) => {
        const dateA = a.confirmDate ? new Date(a.confirmDate).getTime() : 0;
        const dateB = b.confirmDate ? new Date(b.confirmDate).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortValue === 'total') {
      this.odersOfUser.sort((a, b) => b.totalAmount - a.totalAmount);
    }
  }
}
