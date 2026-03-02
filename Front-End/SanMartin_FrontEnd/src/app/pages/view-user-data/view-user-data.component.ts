import { Component } from '@angular/core';
import { userI } from '../../modelos/user.interface';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-user-data',
  standalone: true,
  imports: [],
  templateUrl: './view-user-data.component.html',
  styleUrl: './view-user-data.component.scss'
})
export class ViewUserDataComponent {
  ngOnInit(){
    this.loadUserData();
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

  loadUserData():void{
    let userId = localStorage.getItem("token");
    if (!userId) {
      console.error('No hay "token" en localStorage (id inexistente).');
      return;
    }
    this.api.searchUserById(userId).subscribe({
      next: (data) => {
        this.user = data.data;
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }

  goModify(){
    this.router.navigate(['/modify-user']);
  }

  getFormattedDate(date: Date): string {
    return date.toString().split('T')[0];
  }

}
