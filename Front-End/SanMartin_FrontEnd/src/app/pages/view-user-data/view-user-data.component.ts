import { Component } from '@angular/core';
import { userI } from '../../modelos/user.interface';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-view-user-data',
  standalone: true,
  imports: [NgIf],
  templateUrl: './view-user-data.component.html',
  styleUrl: './view-user-data.component.scss'
})
export class ViewUserDataComponent {

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const token = sessionStorage.getItem("token");

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserData(token);
  }

  constructor(private api:ApiService, private router:Router){ }

  user : userI = {
    id: "",
    name: "",
    surname: "",
    password: "",
    type: "",
    mail: "",
    cellphone: "",
    birthDate: new Date(),
    dni: ""
  }

  loadUserData(userId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.api.searchUserById(userId).subscribe({
      next: (data) => {
        this.user = data.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "No se pudo cargar la información del usuario.";
        this.isLoading = false;
      }
    });
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }

  goModify(){
    this.router.navigate(['/modify-user']);
  }

  getFormattedDate(date: Date | string): string {
    if (!date) return '';

    if (typeof date === 'string') {
      return date.split('T')[0].split('-').reverse().join('/');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }
}
