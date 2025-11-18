/**
 * ContactMeComponent
 * -------------------
 *
 * Kontaktformular mit smarter Validierung:
 * - Fehler erscheinen nur bei invalidem Submit
 * - Erfolg blendet alle Fehlerzustände zurück
 * - Automatisches Timeout bei Fehlermeldungen
 */

import {
  Component,
  inject,
  ChangeDetectorRef,
  NgZone,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  CommonModule,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  isPlatformBrowser,
  DOCUMENT,
} from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../shared/footer/footer.component';
import { LanguageService, SupportedLang } from '../shared/language.service';
import { SectionNavService } from '../shared/sections.config';
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' })),
      ]),
    ]),
  ],
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss', './contact-me.component.media.scss'],
})
export class ContactMeComponent implements OnInit {
  private http = inject(HttpClient);
  private sectionNav = inject(SectionNavService);

  currentLang: SupportedLang = 'de';
  isSuccess = false;

  /** Hauptdatenmodell */
  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false,
  };

  /** Felder, deren Fehler angezeigt werden */
  blurredFields: Record<'name' | 'email' | 'message' | 'agreement', boolean> = {
    name: false,
    email: false,
    message: false,
    agreement: false,
  };

  private hideTimers: { [key: string]: any } = {};

  /** Backend-Konfiguration */
  post = {
    endPoint: 'https://stanislav-levin.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json' as const,
    },
  };

  /** Mehrsprachige Texte */
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
        ru: 'Какой у тебя адрес E-mail?',
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
    errorPlaceholders: {
      name: {
        empty: {
          de: 'Bitte gib deinen Namen ein.',
          en: 'Please enter your name.',
          ru: 'Введите ваше имя.',
        },
        tooShort: {
          de: 'Der Name muss mindestens 3 Zeichen lang sein.',
          en: 'Name must be at least 3 characters long.',
          ru: 'Имя должно содержать не менее 3 символов.',
        },
        invalidChars: {
          de: 'Nur Buchstaben und ein Leerzeichen sind erlaubt.',
          en: 'Only letters and one space are allowed.',
          ru: 'Допустимы только буквы и один пробел.',
        },
      },
      email: {
        empty: {
          de: 'Bitte gib deine E-Mail-Adresse ein.',
          en: 'Please enter your email address.',
          ru: 'Введите адрес электронной почты.',
        },
        invalidFormat: {
          de: 'Bitte gib eine gültige E-Mail-Adresse ohne Leerzeichen ein.',
          en: 'Please enter a valid email address without spaces.',
          ru: 'Введите корректный адрес электронной почты без пробелов.',
        },
      },
      message: {
        empty: {
          de: 'Bitte schreibe eine Nachricht.',
          en: 'Please write a message.',
          ru: 'Пожалуйста, напишите сообщение.',
        },
        tooShort: {
          de: 'Die Nachricht ist zu kurz (min. 4 Zeichen).',
          en: 'The message is too short (min. 4 characters).',
          ru: 'Сообщение слишком короткое (мин. 4 символа).',
        },
        leadingSpace: {
          de: 'Die Nachricht darf nicht mit einem Leerzeichen beginnen.',
          en: 'The message cannot start with a space.',
          ru: 'Сообщение не должно начинаться с пробела.',
        },
      },
    },
    checkbox: {
      de: {
        before: 'Ich habe die ',
        link: 'Datenschutzerklärung',
        after: ' gelesen und bin mit der Verarbeitung meiner Daten einverstanden.',
      },
      en: {
        before: 'I have read the ',
        link: 'privacy policy',
        after: ' and agree to the processing of my data.',
      },
      ru: {
        before: 'Я прочитал(а) ',
        link: 'политику конфиденциальности',
        after: ' и согласен(на) на обработку моих данных.',
      },
    },
    submit: {
      de: 'Nachricht senden',
      en: 'Send Message',
      ru: 'Отправь',
    },
  };

  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private nav: SectionNavService
  ) {}

  ngOnInit(): void {
    this.langService.lang$.subscribe((lang) => {
      this.zone.runOutsideAngular(() => {
        this.currentLang = lang;
        queueMicrotask(() => this.zone.run(() => this.cdr.detectChanges()));
      });
    });
  }

  /** prüft, ob Error angezeigt werden soll */
  shouldShowError(field: keyof typeof this.blurredFields, control: any): boolean {
    const show = this.blurredFields[field] && control.invalid;

    if (show && !this.hideTimers[field]) {
      this.hideTimers[field] = setTimeout(() => {
        this.blurredFields[field] = false;
        delete this.hideTimers[field];
        this.cdr.detectChanges();
      }, 5000);
    }

    return show;
  }

  onInputChange(field: keyof typeof this.blurredFields): void {
    this.blurredFields[field] = false;
  }

  /**
   * Klick auf den Submit-Button (auch bei ungültigem Formular)
   */
  handleSubmitClick(form: NgForm): void {
    if (!form) return;

    if (form.valid) {
      this.onSubmit(form);
      return;
    }

    Object.keys(form.controls).forEach((key) => {
      const control = form.controls[key];
      if (control.invalid) {
        this.blurredFields[key as keyof typeof this.blurredFields] = true;
        this.shouldShowError(key as keyof typeof this.blurredFields, control);
      }
    });

    this.cdr.detectChanges();
  }

  /**
   * Tatsächliches Senden an Backend
   */
  onSubmit(form: NgForm): void {
    this.contactData.email = this.contactData.email.trim();

    if (!form.valid) {
      this.handleSubmitClick(form);
      return;
    }

    this.http
      .post(this.post.endPoint, this.post.body(this.contactData), this.post.options)
      .subscribe({
        next: () => {
          // ✅ Erfolgreich gesendet
          this.isSuccess = true;

          // ❌ Fehlerzustände sofort löschen, damit keine alten Popups aufblitzen
          Object.keys(this.blurredFields).forEach((k) => (this.blurredFields[k as keyof typeof this.blurredFields] = false));

          this.cdr.detectChanges();

          // Hinweis ausblenden nach 4s
          setTimeout(() => (this.isSuccess = false), 4000);

          // Formular leeren
          form.resetForm({
            name: '',
            email: '',
            message: '',
            agreement: false,
          });
        },
        error: (error) => {
          console.error('❌ Fehler beim Versand:', error);
          this.isSuccess = false;
        },
      });
  }

  get isFormAlmostValid(): boolean {
    const { name, email, message, agreement } = this.contactData;
    return (
      name.trim().length > 2 &&
      /^(?!\s*$)[A-Za-zÄÖÜäöüß\- ]{2,}$/.test(name) &&
      /^(?!\s)[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[A-Za-z]{2,}$/.test(email) &&
      message.trim().length >= 4 &&
      !agreement
    );
  }

  scrollToHero(): void {
    this.sectionNav.requestScroll('hero');
  }

  navigateAndScroll(path: string[]): void {
    const target = path.join('/');
    const isHome = target === '/' || target === '';

    this.router.navigate(path).then((success: boolean) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        requestAnimationFrame(() => {
          win.scrollTo({ top: 0, behavior: 'auto' });
        });

        if (isHome) {
          this.nav.requestScroll('hero');
          this.nav.setActive('hero');
        }
      }
    });
  }

  get checkboxHint(): string {
    switch (this.currentLang) {
      case 'de':
        return 'Bitte bestätige die Datenschutzerklärung.';
      case 'en':
        return 'Please confirm the privacy policy.';
      case 'ru':
        return 'Пожалуйста, подтвердите политику конфиденциальности.';
      default:
        return 'Bitte bestätige die Datenschutzerklärung.';
    }
  }

  get successHint(): string {
    switch (this.currentLang) {
      case 'de':
        return 'Nachricht erfolgreich gesendet!';
      case 'en':
        return 'Message sent successfully!';
      case 'ru':
        return 'Сообщение успешно отправлено!';
      default:
        return 'Nachricht erfolgreich gesendet!';
    }
  }
}
