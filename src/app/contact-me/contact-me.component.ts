import {
  Component,
  Output,
  EventEmitter,
  inject,
  ChangeDetectorRef,
  NgZone,
  OnInit
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { LanguageService, SupportedLang } from '../shared/language.service';

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
    CommonModule,
  ],
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss'],
})
export class ContactMeComponent implements OnInit {
  http = inject(HttpClient);
  @Output() scrollToTop = new EventEmitter<void>();

  currentLang: SupportedLang = 'de';

  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false,
  };

  post = {
    endPoint: 'https://stanislav-levin.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json' as const,
    },
  };

  translations = {
    header: {
      de: 'Lass uns was Cooles zusammen bauen',
      en: "Let's build something awesome together",
      ru: 'Давай создадим что-то крутое вместе',
    },
    subheader: {
      de: 'Hast du ein Problem zu lösen?',
      en: 'Do you have a problem to solve?',
      ru: 'У тебя есть задача, которую нужно решить?',
    },
    description: {
      de: 'Ich unterstütze Unternehmen in der Metall- und Fertigungsindustrie dabei, Prozesse zu automatisieren und den Schritt in Richtung Industrie 4.0 zu gehen.',
      en: 'I help companies in the metal and manufacturing industry automate processes and move toward Industry 4.0.',
      ru: 'Я помогаю компаниям в области металлообработки и производства автоматизировать процессы и сделать шаг к Индустрии 4.0.',
    },
    labels: {
      name: {
        de: 'Wie ist dein Name?',
        en: 'What is your name?',
        ru: 'Как тебя зовут?',
      },
      email: {
        de: 'Wie ist deine E-Mail?',
        en: 'What is your email?',
        ru: 'Какой у тебя адрес электронной почты?',
      },
      message: {
        de: 'Wie kann ich dir helfen?',
        en: 'How can I help you?',
        ru: 'Чем я могу помочь?',
      },
    },
    placeholders: {
      name: {
        de: 'Dein Name kommt hier hin',
        en: 'Your name goes here',
        ru: 'Введите ваше имя',
      },
      email: {
        de: 'deine-Email@email.com',
        en: 'your-email@email.com',
        ru: 'ваш-email@email.com',
      },
      message: {
        de: 'Hallo Stanislav, mich interessiert...',
        en: 'Hi Stanislav, I’m interested in...',
        ru: 'Привет, Станислав! Меня интересует...',
      },
    },
    checkbox: {
      de: 'Ich habe die Datenschutzerklärung gelesen und bin mit der Verarbeitung meiner Daten einverstanden.',
      en: 'I have read the privacy policy and agree to the processing of my data.',
      ru: 'Я прочитал(а) политику конфиденциальности и согласен(на) на обработку моих данных.',
    },
    submit: {
      de: 'Nachricht senden',
      en: 'Send Message',
      ru: 'Отправить сообщение',
    },
  };

  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.langService.lang$.subscribe((lang) => {
      this.zone.runOutsideAngular(() => {
        this.currentLang = lang;
        queueMicrotask(() => this.zone.run(() => this.cdr.detectChanges()));
      });
    });
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData), this.post.options)
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
}
