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
  styleUrl: './view-orders.component.scss'
})
export class ViewOrdersComponent {
  
  ngOnInit(): void {
    this.getOrders();
  }

  constructor(private api: ApiService, private router: Router) { }

  odersOfUser : orderI[] = [];

  getOrders(){
    let userId = "" + localStorage.getItem("token");
    console.log("recupero-----------", userId);
    this.api.searchOrdersByUser(userId).subscribe({
      next: (data) => {                                       //Condicion de si ya se efectuo la compra que no aparezca la orden aca.
        for (let i = 0; i < data.data.length; i++){
          if(data.data[i].statusHistory != "UNPAID"){
            this.odersOfUser.push(data.data[i])
          }
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  viewOrderDetails(orderId:any){
    localStorage.setItem("OrderId", orderId);
    this.router.navigate(['/view-single-order']);
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }
}
