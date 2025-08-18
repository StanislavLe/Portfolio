import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';      // ⬅️ wichtig für ngForm & ngModel


@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent {

  contactData = {
    name: '',
    email: '',
    message: ''
  };

  constructor() {
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      console.log(this.contactData)
    };
  }







}
