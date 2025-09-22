import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';      // ⬅️ wichtig für ngForm & ngModel
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ wichtig für routerLink
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgIf,
    RouterModule,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent {

  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false
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
