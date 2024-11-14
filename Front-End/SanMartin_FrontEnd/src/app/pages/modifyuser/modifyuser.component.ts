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
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUserData();
  }

  loadUserData(): void {
    if (this.userId) {
      this.api.searchUserById(this.userId).subscribe({
        next: (data) => {
          this.user = data.data;
          this.userForm.patchValue(this.user);
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      const updatedUser: userI = { ...this.userForm.value, id: this.userId };
      this.api.updateUser(updatedUser).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }
}
