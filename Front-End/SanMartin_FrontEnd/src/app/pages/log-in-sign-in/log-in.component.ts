import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service.js';
import { loginI } from '../../modelos/login.interface.js';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { responseI } from '../../modelos/response.interface.js';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  loginForm = new FormGroup({
    user : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required)
  })

  constructor(private api:ApiService, private router:Router){ }

  onLogin(form:any){
     const login:loginI= {
     user: form.user,
     password: form.password
    }
    console.log(login);
    this.api.loginByDni("/43399550").subscribe({
      next: (data) => {
        let dataResponse:responseI = data;
        if (dataResponse.data.dni == form.user && dataResponse.data.password == form.password){
          alert('ingreso valido')
          localStorage.setItem("token", dataResponse.data.id);
          this.router.navigate(['home']);
        }
        else {alert('fail')}
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

}
