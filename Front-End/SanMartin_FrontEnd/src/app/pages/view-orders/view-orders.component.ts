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

  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.getOrders();
  }

  constructor(private api: ApiService, private router: Router) { }

  odersOfUser: orderI[] = [];

  getOrders() {
    const userId = sessionStorage.getItem("token");

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;
    this.odersOfUser = [];

    this.api.searchOrdersByUser(userId).subscribe({
      next: (data) => {

        this.odersOfUser = data.data.filter(order =>
          order.statusHistory !== "UNPAID" &&
          order.statusHistory !== "CANCELLED"
        );

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "No se pudieron cargar los pedidos.";
        this.isLoading = false;
      }
    });
  }

  viewOrderDetails(orderId: any) {
    sessionStorage.setItem("orderId", orderId);
    this.router.navigate(['/order-detail']);
  }

  goBack() {
    this.router.navigate(['/admin-menu']);
  }

  sortOrders(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value;
    if (sortValue === 'date') {
      this.odersOfUser = [...this.odersOfUser].sort((a, b) => {
        const dateA = a.confirmDate ? new Date(a.confirmDate).getTime() : 0;
        const dateB = b.confirmDate ? new Date(b.confirmDate).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortValue === 'total') {
      this.odersOfUser = [...this.odersOfUser].sort((a, b) => 
        b.totalAmount - a.totalAmount
      );
    }
  }
}
