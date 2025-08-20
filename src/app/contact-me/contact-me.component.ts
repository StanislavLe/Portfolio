import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';      // ⬅️ wichtig für ngForm & ngModel
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';


@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [FormsModule, NgFor, NgSwitch, NgSwitchCase, NgIf],
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

@Output() scrollToTop = new EventEmitter<void>();






}
