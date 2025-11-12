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
 * - `NgForm` zur Template-basierten Formularsteuerung
 * - Sprachwechsel in Echtzeit durch `LanguageService`
 * - Nutzung von `NgZone` + `ChangeDetectorRef` für performantes Rendering
 * - API-Call via `HttpClient` mit JSON-Body und Custom Headern
 */

import {
  Component,
  inject,
  ChangeDetectorRef,
  NgZone,
  OnInit
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  CommonModule,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase
} from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { LanguageService, SupportedLang } from '../shared/language.service';
import { SectionNavService } from '../shared/sections.config';

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
  styleUrls: ['./contact-me.component.scss', './contact-me.component.media.scss']
})
export class ContactMeComponent implements OnInit {
  /**
   * HTTP-Client für Formularübermittlung
   */
  private http = inject(HttpClient);

  /**
   * Zugriff auf Section-Navigation für Scroll-to-Top / Hero
   */
  private sectionNav = inject(SectionNavService);

  /**
   * Aktuell ausgewählte Sprache.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Zeigt an, ob das Formular erfolgreich versendet wurde.
   */
  isSuccess = false;

  /**
   * Datenmodell für das Formular.
   */
  contactData = {
    name: '',
    email: '',
    message: '',
    agreement: false,
  };

  /**
   * Konfiguration für den HTTP-POST-Request zum PHP-Mail-Endpunkt.
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
   * Mehrsprachige Texte und Beschriftungen für das Formular.
   * Enthält Header, Label, Placeholder, Fehlertexte und Buttons.
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
    errorPlaceholders: {
      name: {
        de: 'Bitte trage einen Namen ein',
        en: 'Please enter your name',
        ru: 'Пожалуйста, введите ваше имя',
      },
      email: {
        de: 'Bitte trage eine E-Mail-Adresse ein',
        en: 'Please enter a valid email address',
        ru: 'Пожалуйста, введите адрес электронной почты',
      },
      message: {
        de: 'Schreibe eine Nachricht (min. 4 Zeichen)',
        en: 'Write a message (min. 4 characters)',
        ru: 'Напишите сообщение (мин. 4 символа)',
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

  /**
   * Konstruktor mit Dependency Injection für Sprachsteuerung und Change Detection.
   *
   * @param langService - Service zur Sprachverwaltung
   * @param cdr - ChangeDetectorRef für manuelles Aktualisieren des Templates
   * @param zone - Angular NgZone für performante DOM-Aktualisierung außerhalb Angulars Change Detection
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Reaktives Sprachsystem:
   * Aktualisiert alle Texte bei Sprachwechsel über den `LanguageService`.
   * Führt UI-Updates in einer Microtask aus, um Performance zu optimieren.
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
   * @param ngForm - Template-gesteuertes Angular-Formular
   *
   * - Validiert Eingaben
   * - Sendet POST-Request an definierten PHP-Endpunkt
   * - Setzt Formular bei Erfolg zurück
   * - Zeigt Erfolgsstatus temporär an
   */
  onSubmit(ngForm: NgForm): void {
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
            console.error('❌ Error:', error);
            this.isSuccess = false;
          },
        });
    }
  }

  /**
   * Scrollt zurück zum Hero-Abschnitt am Seitenanfang.
   * Wird z. B. im Footer verwendet.
   */
  scrollToHero(): void {
    this.sectionNav.requestScroll('hero');
  }

  /**
   * Prüft, ob das Formular fast vollständig, aber noch nicht abgesendet ist.
   * Dient z. B. für dynamische UI-Stylingzustände oder Validierungshinweise.
   */
  get isFormAlmostValid(): boolean {
    const name = this.contactData.name ?? '';
    const email = this.contactData.email ?? '';
    const message = this.contactData.message ?? '';
    const agreement = !!this.contactData.agreement;

    return (
      name.trim().length > 1 &&
      /^[A-Za-zÀ-ž\- ]{2,}$/.test(name) &&
      /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(email) &&
      message.trim().length >= 4 &&
      !agreement
    );
  }

  /**
   * Liefert den Datenschutz-Hinweis in der aktuellen Sprache.
   */
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

  /**
   * Liefert den Erfolgshinweis nach erfolgreichem Senden des Formulars.
   */
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
