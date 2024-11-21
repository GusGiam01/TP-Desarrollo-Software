import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-us-mail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './send-us-mail.component.html',
  styleUrl: './send-us-mail.component.scss'
})
export class SendUsMailComponent {
  constructor(private api:ApiService, private router:Router){ }

  sendEmail = new FormGroup({
    from: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required)
  })

  onSending(emailForm:any){
    if (emailForm.from != "" && emailForm.text != "" && emailForm.subject != ""){
      let email = {
          to: "gustgiam2001@gmail.com",
          subject: ("" + emailForm.subject).toUpperCase(),
          text: ("De: " + emailForm.from + "\n" + emailForm.text).toUpperCase()
      }
      this.api.sendEmail(email).subscribe({
        next: (data) => {
          console.log("Email enviado.");
          alert("Su email fue enviado!");
          this.router.navigate(['home']).then(() => {
            location.reload()
          });
        },
        error: (e) => {
          console.log(e)
        }
      })
    }
  }
}
