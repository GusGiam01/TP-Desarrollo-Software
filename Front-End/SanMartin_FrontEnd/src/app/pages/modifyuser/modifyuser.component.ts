import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { userI } from '../../modelos/user.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modifyuser.component.html',
  styleUrls: ['./modifyuser.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId: string = '';
  userDNI: string = '';
  user: userI | undefined;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      cellphone: ['', Validators.required],
      age: [null, [Validators.min(0)]],
      birthDate: ['', Validators.required],
      dni: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userDNI = "" + localStorage.getItem("dni");
    this.userId = "" + localStorage.getItem("token");
    this.loadUserData(this.userDNI);
  }

  loadUserData(userDNI:string): void {
    if (userDNI) {
      this.api.searchUserById(userDNI).subscribe({
        next: (data) => {
          this.user = data.data;
          this.userForm.patchValue({
            name: this.user.name,
            surname: this.user.surname,
            password: this.user.password,
            type: this.user.type,
            mail: this.user.mail,
            cellphone: this.user.cellphone,
            age: this.user.age,
            birthDate: this.user.birthDate,
            dni: this.user.dni,
            address: this.user.address
          });
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      const updatedUser: userI = {
        id: this.userId,
        name: this.userForm.get('name')?.value,
        surname: this.userForm.get('surname')?.value,
        password: this.userForm.get('password')?.value,
        type: this.userForm.get('type')?.value,
        mail: this.userForm.get('mail')?.value,
        cellphone: this.userForm.get('cellphone')?.value,
        age: this.userForm.get('age')?.value,
        birthDate: this.userForm.get('birthDate')?.value,
        dni: this.userForm.get('dni')?.value,
        address: this.userForm.get('address')?.value,
        orders: []
      };
      if (this.user != undefined) {
        updatedUser.orders = this.user.orders;
      };
      this.api.updateUser(updatedUser).subscribe({
        next: () => {
          this.router.navigate(['/admin-menu']);
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  goBack(){
    this.router.navigate(['/admin-menu']);
  }
}
