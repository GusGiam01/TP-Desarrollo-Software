import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../servicios/api/api.service.js';
import { loginI } from '../../modelos/login.interface.js';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  loginForm = new FormGroup({
    dni: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin(formValue: any) {

    if (this.loginForm.invalid) {
      this.errorMessage = "Complete todos los campos.";
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    const login: loginI = {
      dni: formValue.dni,
      password: formValue.password
    };

    this.api.login(login).subscribe({
      next: (data) => {
        this.authService.login(data.data.id);
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

  recoverPassword(dni: string | null | undefined) {

    if (!dni) {
      this.errorMessage = "Ingrese su DNI para recuperar la contraseña.";
      return;
    }

    this.api.searchUserByDni(dni).subscribe({
      next: (data) => {

        const emailData = {
          to: data.data.mail,
          subject: "Recuperar contraseña",
          text: "Solicitamos el cambio de contraseña..."
        };

        this.api.sendEmail(emailData).subscribe({
          next: () => {
            this.successMessage = "Se envió un correo para recuperar la contraseña.";
          },
          error: () => {
            this.errorMessage = "Error al enviar el correo.";
          }
        });

      },
      error: () => {
        this.errorMessage = "No existe ninguna cuenta con ese DNI.";
      }
    });
  }

  signin() {
    this.router.navigate(['signin']);
  }
}