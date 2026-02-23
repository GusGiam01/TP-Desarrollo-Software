import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';
import { signinI } from '../../modelos/signin.interface.js';
import { AuthService } from '../../servicios/auth.service.js';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  signinForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmpassword: new FormControl('', Validators.required),
    mail: new FormControl('', Validators.required),
    dni: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
    cellphone: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  private valPass(password: string): boolean {
    const tieneLongitudValida = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    return tieneLongitudValida && tieneMayuscula && tieneNumero;
  }

  onSignUp(formValue: any) {

    if (this.signinForm.invalid) {
      this.errorMessage = "Complete todos los campos.";
      return;
    }

    if (formValue.password !== formValue.confirmpassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      return;
    }

    if (!this.valPass(formValue.password)) {
      this.errorMessage = "La contraseña debe tener 8 caracteres, una mayúscula y un número.";
      return;
    }

    const today = new Date();
    const birthDate = new Date(formValue.birthDate);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      this.errorMessage = "Debe ser mayor de edad.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const user: signinI = {
      ...formValue,
      type: formValue.type.toUpperCase() === "DSW2024SM" ? "ADMIN" : "CLIENT",
      age
    };

    this.api.postUser(user).subscribe({
      next: (data) => {
        this.authService.login(data.data.id);
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
}