import { Component } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'sm-contact',
  standalone: true,
  imports: [],
  templateUrl: './sm-contact.component.html',
  styleUrl: './sm-contact.component.scss'
})
export class SmContactComponent {
  constructor(private api:ApiService, private router:Router){ }
  hola = "%20Gustavo"
  redirectToComponent() {
    this.router.navigate(['/send-us-an-email']);
  }
}
