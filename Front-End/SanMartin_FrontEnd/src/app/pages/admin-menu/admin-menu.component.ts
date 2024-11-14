import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent {

  constructor(private api: ApiService, private router: Router) { }

  navigateTo() {
    this.router.navigate(['/add-product']);
  }
}

