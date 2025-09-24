import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HttpClient } from '@angular/common/http';

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

  http = inject(HttpClient);

  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false
  };

  post = {
    endPoint: 'https://stanislav-levin.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json' as const
    }
  };

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.http.post(this.post.endPoint, this.post.body(this.contactData), this.post.options)
        .subscribe({
          next: (response: any) => {
            console.log('✅ Response:', response);
            ngForm.resetForm();
          },
          error: (error: any) => {
            console.error('❌ Error:', error);
          },
          complete: () => console.info('📬 send post complete'),
        });
    }
  }

  @Output() scrollToTop = new EventEmitter<void>();
}
