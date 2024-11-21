import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { userI } from '../../modelos/user.interface';
import { userPatchI } from '../../modelos/userPatch.interface';
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
      mail: ['', [Validators.required, Validators.email]],
      cellphone: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = "" + localStorage.getItem("token");
    this.loadUserData(this.userId);
  }

  loadUserData(userId:string): void {
    if (userId) {
      this.api.searchUserById(userId).subscribe({
        next: (data) => {
          this.user = data.data;
          this.userForm.patchValue({
            name: this.user.name,
            surname: this.user.surname,
            password: this.user.password,
            mail: this.user.mail,
            cellphone: this.user.cellphone,
            birthDate: this.user.birthDate,
            dni: this.user.dni,
            //addresses: this.user.addresses
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
      const updatedUser: userPatchI = {
        id: this.userId,
        name: this.userForm.get('name')?.value,
        surname: this.userForm.get('surname')?.value,
        password: this.userForm.get('password')?.value,
        mail: this.userForm.get('mail')?.value,
        cellphone: this.userForm.get('cellphone')?.value,
        birthDate: this.userForm.get('birthDate')?.value,
        age: this.calculateAge(this.userForm.get('birthDate')?.value),

      };
      this.api.patchUser(updatedUser).subscribe({
        next: () => {
          this.router.navigate(['/view-user-data']);
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  
    return age;
  }

  goBack(){
    this.router.navigate(['/view-user-data']);
  }
}
