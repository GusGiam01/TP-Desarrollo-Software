import { Component, NgModule } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service.js';
import { loginI } from '../../modelos/login.interface.js';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { responseI } from '../../modelos/response.interface.js';
import { Subject, timer } from 'rxjs';
import { userI } from '../../modelos/user.interface.js';
import { signinI } from '../../modelos/signin.interface.js';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  dni = "";

  loginForm = new FormGroup({
    dni : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required)
  })

  signinForm = new FormGroup({
    name : new FormControl('', Validators.required),
    surname : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
    confirmpassword: new FormControl('', Validators.required),
    mail : new FormControl('', Validators.required),
    dni : new FormControl('', Validators.required),
    birthDate : new FormControl('', Validators.required),
    cellphone : new FormControl('', Validators.required),
    type : new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required),
  })

  valPass(password: string): boolean {
    const tieneLongitudValida = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    return tieneLongitudValida && tieneMayuscula && tieneNumero;
  }

  constructor(private api:ApiService, private router:Router){ }

  onLogin(form:any){
     const login:loginI= {
     dni: form.dni,
     password: form.password
    }
    this.api.searchUserByDni(form.dni).subscribe({
      next: (data) => {
        let dataResponse:responseI = data;
        console.log(dataResponse.data)
        if (dataResponse.data.dni == form.dni && dataResponse.data.password == form.password){

          localStorage.setItem("token", dataResponse.data.id);
          localStorage.setItem("dni", dataResponse.data.dni);
          localStorage.setItem("type", dataResponse.data.type);
          this.router.navigate(['home']).then(() => {
            location.reload()
          });
        } 
        else {
          alert("La contraseña ingresada es incorrecta.")
        }
      },
      error: (e) => {
        alert("No exite usuario con ese número de documento.")
        console.log(e);
      }
    });
  }

  OnSignUp(form:any){
    const user:signinI = {
      name: form.name,
      surname: form.surname,
      birthDate: form.birthDate,
      mail: form.mail,
      dni: form.dni,
      cellphone: form.cellphone,
      type: form.type,
      password: form.password
    }
    const today = new Date();
    const birthDate = new Date(form.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    user.age = age;
    this.api.searchUserByDni(form.dni).subscribe({                  
      next: () => {
        alert("Ya existe un usuario con ese DNI.")
      },
      error: (e) => {
        if (age > 17){
          if (this.valPass(form.password)){
            if (form.password == form.confirmpassword ) {
              this.api.postUser(user).subscribe({
                next: (data) => {
                  let dataResponse:responseI = data;
                  localStorage.setItem("token", dataResponse.data.id);
                  localStorage.setItem("dni", dataResponse.data.dni);
                  localStorage.setItem("type", dataResponse.data.type);
                  this.router.navigate(['home']).then(() => {
                    location.reload()
                  });
                }
              })
            } else {alert("Las contraseñas no coinciden.")}
          } else {alert("La contraseña no cumple los requisitos, esta debe tener al menos una letra mayúscula, 8 caracteres y al menos un número")}
        } else {alert("Usted no es mayor de edad, no puede crear una cuenta.")}
      }
    })
  }

  recoverPassword(dni:string){
    if (dni != "") {
      this.api.searchUserByDni(dni).subscribe({
        next: (data) => {
          const emailData = {
            to: data.data.mail,
            subject: "Recuperar contraseña",
            text: "Su contraseña es " + data.data.password
          }
          this.api.sendEmail(emailData).subscribe({
            next: (response) => {
              alert('Hemos enviado un mail a su correo!');
            },
            error: (e) => {
              alert('Hubo un error al enviar el correo de recuperacion');
              console.error(e);
            }
          });
        },
        error: (e) => {
          console.log(e)
          alert('No existe ninguna cuenta con ese DNI.')
        }
      })
    }
    else {
      alert('Por favor ingrese su DNI para poder recurperar su contraeña.')
    }
    
  }
}

