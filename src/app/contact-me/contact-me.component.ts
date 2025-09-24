import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';      // ⬅️ wichtig für ngForm & ngModel
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ wichtig für routerLink
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';


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

  http = inject(HttpClient)

  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false
  };

  constructor() {
  }


  mailTest = false;

  post = {
    endPoint: 'https://stanislav-levin.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as const
    }
  };

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.http.post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response: any) => {

            ngForm.resetForm();
          },
          error: (error: any) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {

      ngForm.resetForm();
    }
  }

  @Output() scrollToTop = new EventEmitter<void>();






}
