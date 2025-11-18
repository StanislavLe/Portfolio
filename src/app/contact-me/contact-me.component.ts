/**
 * ContactMeComponent
 * -------------------
 *
 * Diese Komponente stellt die Kontaktsektion der Website dar.
 * Sie enthält ein Formular zur direkten Kontaktaufnahme per E-Mail,
 * inklusive Validierung, Mehrsprachigkeit und einer asynchronen Backend-Anfrage.
 *
 * Hauptaufgaben:
 * - Anzeige und Validierung des Kontaktformulars
 * - Versand der Formulardaten an ein PHP-Mail-Backend
 * - Reaktive Sprachunterstützung für alle Formulartexte
 * - Anzeige dynamischer Hinweise (Erfolg, Datenschutz, etc.)
 * - Integration mit der globalen Section-Navigation (`SectionNavService`)
 *
 * Besonderheiten:
 * - Template-basierte Formularsteuerung mit `NgForm`
 * - Dynamische Animationen für Fehlermeldungen
 * - Sprachwechsel in Echtzeit durch `LanguageService`
 * - Nutzung von `NgZone` + `ChangeDetectorRef` für performantes Rendering
 * - API-Call via `HttpClient` mit JSON-Body und Custom Headern
 */

import {Component,inject,ChangeDetectorRef,NgZone,OnInit,Inject, PLATFORM_ID} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor, NgIf,NgSwitch, NgSwitchCase, isPlatformBrowser, DOCUMENT} from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../shared/footer/footer.component';
import { LanguageService, SupportedLang } from '../shared/language.service';
import { SectionNavService } from '../shared/sections.config';
import {trigger,transition,style,animate} from '@angular/animations';

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
  /** HTTP-Client für den Versand der Formulardaten an das Backend */
  private http = inject(HttpClient);

  /** Zugriff auf globale Section-Navigation (z. B. für Scroll zu Hero) */
  private sectionNav = inject(SectionNavService);

  /** Aktuell ausgewählte Sprache */
  currentLang: SupportedLang = 'de';

  /** Zeigt an, ob das Formular erfolgreich versendet wurde */
  isSuccess = false;

  /** Datenmodell des Kontaktformulars */
  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false,
  };

  /** Zustände für Popup-Fehlermeldungen einzelner Felder */
  errorPopups = {
    name: false,
    email: false,
    message: false,
  };

  /**
   * Verfolgt, ob ein Eingabefeld bereits verlassen wurde (Blur-Event).
   * Steuert, ob Validierungsfehler angezeigt werden dürfen.
   */
  blurredFields = {
    /** Status für Namensfeld */
    name: false,
    /** Status für E-Mail-Feld */
    email: false,
    /** Status für Nachrichtenfeld */
    message: false,
  };

 /**
 * Prüft, ob für ein bestimmtes Eingabefeld ein Fehler angezeigt werden soll.
 * 
 * Startet bei aktivem Fehler einen Timer, der die Fehlermeldung nach 3 Sekunden
 * automatisch wieder ausblendet und das UI aktualisiert.
 *
 * @param field   Feldname ('name' | 'email' | 'message')
 * @param control Zugehöriges `NgModel`-Objekt
 * @returns `true`, wenn der Fehler angezeigt werden soll
 */
private hideTimers: { [key: string]: any } = {};

shouldShowError(field: 'name' | 'email' | 'message', control: any): boolean {
  const show =
    this.blurredFields[field] &&
    control.invalid &&
    (control.dirty || control.touched);
  if (show && !this.hideTimers[field]) {
    this.hideTimers[field] = setTimeout(() => {
      this.blurredFields[field] = false;
      delete this.hideTimers[field];
      this.cdr.detectChanges();
    }, 5000);
  }
  return show;
}

  /**
   * Setzt den Blur-Zustand eines Feldes zurück, sobald der Benutzer erneut tippt.
   *
   * @param field - Das Feld, dessen Blur-Zustand zurückgesetzt werden soll
   *
   * Wird z. B. beim `(input)`-Event ausgelöst, um Fehlermeldungen auszublenden,
   * während der Benutzer eine Korrektur vornimmt.
   */
  onInputChange(field: 'name' | 'email' | 'message'): void {
    this.blurredFields[field] = false;
  }

  /**
   * Konfiguration für den HTTP-POST-Request zum PHP-Mail-Endpunkt.
   * Beinhaltet URL, Request-Body und Header.
   */
  post = {
    endPoint: 'https://stanislav-levin.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json' as const,
    },
  };

  /**
   * Mehrsprachige Texte, Labels, Platzhalter und Fehlermeldungen.
   */
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
    }
    ,
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

  /**
   * Konstruktor – injiziert Sprachservice, Router und DOM-Abhängigkeiten.
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private nav: SectionNavService
  ) { }

  /**
   * Lifecycle Hook – Initialisierung
   * Abonniert Sprachänderungen und aktualisiert dynamisch alle UI-Texte.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe((lang) => {
      this.zone.runOutsideAngular(() => {
        this.currentLang = lang;
        queueMicrotask(() => this.zone.run(() => this.cdr.detectChanges()));
      });
    });
  }

  /**
   * Wird beim Absenden des Formulars aufgerufen.
   *
   * @param ngForm - Das Template-basierte Angular-Formular
   *
   * - Validiert Eingaben
   * - Sendet Daten per POST an das Backend
   * - Zeigt bei Erfolg eine Erfolgsmeldung
   * - Setzt Formular zurück
   */
  onSubmit(ngForm: NgForm): void {
    this.contactData.email = this.contactData.email.trim();

    if (ngForm.submitted && ngForm.form.valid) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData), this.post.options)
        .subscribe({
          next: () => {
            this.isSuccess = true;
            setTimeout(() => (this.isSuccess = false), 4000);
            ngForm.resetForm({
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
  }

  /**
   * Prüft, ob das Formular fast gültig ist (alle Eingaben korrekt, aber Checkbox fehlt).
   * 
   * Wird verwendet, um Tooltips oder UI-Hinweise anzuzeigen.
   */
  get isFormAlmostValid(): boolean {
    const name = this.contactData.name ?? '';
    const email = this.contactData.email ?? '';
    const message = this.contactData.message ?? '';
    const agreement = !!this.contactData.agreement;
    return (
      name.trim().length > 2 &&
      /^(?!\s*$)[A-Za-zÄÖÜäöüß\- ]{2,}$/.test(name) &&
      /^(?!\s)[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[A-Za-z]{2,}$/.test(email) &&
      message.trim().length >= 4 &&
      !agreement
    );
  }

  /**
   * Scrollt zurück zum Hero-Abschnitt am Seitenanfang.
   */
  scrollToHero(): void {
    this.sectionNav.requestScroll('hero');
  }

  /**
   * Führt eine Navigation zu einer bestimmten Route aus und scrollt danach an den Seitenanfang.
   * 
   * @param path - Zielroute (z. B. `['/']` oder `['/legal', 'privacy-policy']`)
   */
  navigateAndScroll(path: string[]): void {
    const target = path.join('/');
    const isHome = target === '/' || target === '';

    this.router.navigate(path).then((success: boolean) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        const html = this.document.documentElement;
        const body = this.document.body;

        requestAnimationFrame(() => {
          win.scrollTo({ top: 0, behavior: 'auto' });
          html.scrollTop = 0;
          body.scrollTop = 0;
        });

        if (isHome) {
          this.nav.requestScroll('hero');
          this.nav.setActive('hero');
        }
      }
    });
  }

  /** Liefert den Datenschutz-Hinweis in der aktuellen Sprache */
  get checkboxHint(): string {
    switch (this.currentLang) {
      case 'de': return 'Bitte bestätige die Datenschutzerklärung.';
      case 'en': return 'Please confirm the privacy policy.';
      case 'ru': return 'Пожалуйста, подтвердите политику конфиденциальности.';
      default: return 'Bitte bestätige die Datenschutzerklärung.';
    }
  }

  /** Liefert den Erfolgshinweis nach erfolgreichem Senden des Formulars */
  get successHint(): string {
    switch (this.currentLang) {
      case 'de': return 'Nachricht erfolgreich gesendet!';
      case 'en': return 'Message sent successfully!';
      case 'ru': return 'Сообщение успешно отправлено!';
      default: return 'Nachricht erfolgreich gesendet!';
    }
  }
}