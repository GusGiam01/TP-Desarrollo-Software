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
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

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
  })

  valPass(password: string): boolean {
    const tieneLongitudValida = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    return tieneLongitudValida && tieneMayuscula && tieneNumero;
  }

  constructor(private api:ApiService, private router:Router){ }

  onLogin(form: any) {

    if (this.loginForm.invalid) {
      this.errorMessage = "Complete todos los campos.";
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    const login: loginI = {
      dni: form.dni,
      password: form.password
    };

    this.api.login(login).subscribe({
      next: (data) => {

        sessionStorage.setItem("token", data.data.id);
        sessionStorage.setItem("type", data.data.type);

        this.isLoading = false;
        this.router.navigate(['home']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "DNI o contraseña incorrectos.";
      }
    });
  }


  OnSignUp(form: any) {
    if (this.signinForm.invalid) {
      this.errorMessage = "Complete todos los campos.";
      return;
    }

    if (form.password !== form.confirmpassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      return;
    }

    if (!this.valPass(form.password)) {
      this.errorMessage = "La contraseña debe tener 8 caracteres, una mayúscula y un número.";
      return;
    }

    const today = new Date();
    const birthDate = new Date(form.birthDate);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      this.errorMessage = "Debe ser mayor de edad.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const user: signinI = {
      ...form,
      type: form.type.toUpperCase() === "DSW2024SM" ? "ADMIN" : "CLIENT",
      age
    };

    this.api.postUser(user).subscribe({
      next: (data) => {
        sessionStorage.setItem("token", data.data.id);
        sessionStorage.setItem("type", data.data.type);
        this.isLoading = false;
        this.router.navigate(['home']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "No se pudo registrar el usuario.";
      }
    });
  }


  recoverPassword(dni:string){
    if (dni != "") {
      this.api.searchUserByDni(dni).subscribe({
        next: (data) => {
          const emailData = {
            to: data.data.mail,
            subject: "Recuperar contraseña",
            text: "Solicitamos el cambio de contraseña..."
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

