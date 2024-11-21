import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [
      CommonModule,
      NgIf
  ],
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent {

  constructor(private api: ApiService, private router: Router) { }

  userType = "";

  ngOnInit():void{
    this.getUser();
  }

  getUser(){
    let id = "" + localStorage.getItem("token");
    this.api.searchUserById(id).subscribe({
      next: (data) => {
        this.userType = data.data.type;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  navigateTo() {
    this.router.navigate(['/add-product']);
  }

  navigateToOrders(){
    this.router.navigate(['/view-orders']);
  }

  navigateToModifyUser(){
    this.router.navigate(['/view-user-data']);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("orderId");
    this.router.navigate(['home']).then(() => {
      location.reload()
    });
  }

  navigateToAddAddress(){
    this.router.navigate(['/list-address']);
  }
}

