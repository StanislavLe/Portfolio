import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { LanguageService, SupportedLang } from '../../shared/language.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  currentLang: SupportedLang = 'de';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0 });
    }

    // 🔁 Live-Update, wenn Sprache geändert wird
    this.langService.lang$.subscribe((lang) => {
      this.zone.runOutsideAngular(() => {
        this.currentLang = lang;
        queueMicrotask(() => this.zone.run(() => this.cdr.detectChanges()));
      });
    });
  }

  translations = {
    title: {
      de: 'Datenschutzerklärung',
      en: 'Privacy Policy',
      ru: 'Политика конфиденциальности',
    },
    generalTitle: {
      de: 'Allgemeiner Hinweis und Pflichtinformationen',
      en: 'General Information and Mandatory Disclosures',
      ru: 'Общие сведения и обязательная информация',
    },
    generalText: {
      de: 'Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.',
      en: 'Protecting your personal data is very important to us. We handle your personal information confidentially and in accordance with legal data protection regulations as well as this privacy policy.',
      ru: 'Защита ваших личных данных является для нас особенно важной. Мы обрабатываем ваши персональные данные конфиденциально и в соответствии с действующими законами о защите данных и настоящей политикой конфиденциальности.',
    },
    responsibleTitle: {
      de: 'Verantwortliche Stelle',
      en: 'Responsible Entity',
      ru: 'Ответственное лицо',
    },
    responsibleText: {
      de: 'Stanislav Levin<br>Rietgasse 6<br>78050 VS-Villingen<br>Deutschland',
      en: 'Stanislav Levin<br>Rietgasse 6<br>78050 VS-Villingen<br>Germany',
      ru: 'Станислав Левин<br>Rietgasse 6<br>78050 VS-Villingen<br>Германия',
    },
    logTitle: {
      de: 'Erfassung allgemeiner Informationen',
      en: 'Collection of General Information',
      ru: 'Сбор общей информации',
    },
    logText: {
      de: 'Beim Zugriff auf unsere Website werden automatisch Informationen allgemeiner Natur erfasst (Server-Logfiles), wie Browsertyp, Betriebssystem oder Internetanbieter. Diese Daten lassen keine Rückschlüsse auf Ihre Person zu.',
      en: 'When accessing our website, general information is automatically collected (server log files) such as browser type, operating system, or internet service provider. These data do not allow any conclusions about your identity.',
      ru: 'При доступе к нашему сайту автоматически собирается общая информация (файлы журнала сервера), такая как тип браузера, операционная система или интернет-провайдер. Эти данные не позволяют идентифицировать вас лично.',
    },
    cookiesTitle: {
      de: 'Cookies',
      en: 'Cookies',
      ru: 'Cookies (файлы cookie)',
    },
    cookiesText: {
      de: 'Unsere Website verwendet teilweise sogenannte Cookies. Sie richten keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.',
      en: 'Our website uses so-called cookies. They do not harm your computer or contain viruses. Cookies make our offer more user-friendly, efficient, and secure.',
      ru: 'Наш сайт использует так называемые cookies. Они не наносят вреда вашему устройству и не содержат вирусов. Cookies делают использование сайта более удобным, эффективным и безопасным.',
    },
    rightsTitle: {
      de: 'Rechte des Nutzers',
      en: 'User Rights',
      ru: 'Права пользователя',
    },
    rightsText: {
      de: 'Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung. Sie haben außerdem ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.',
      en: 'You have the right to free information about your stored personal data, its origin and recipient, and the purpose of data processing. You also have the right to correction, blocking, or deletion of this data at any time.',
      ru: 'Вы имеете право в любое время бесплатно получать информацию о ваших персональных данных, их происхождении, получателях и цели обработки. Также вы имеете право на исправление, блокировку или удаление этих данных.',
    },
    contactTitle: {
      de: 'Kontakt',
      en: 'Contact',
      ru: 'Контакты',
    },
    contactText: {
      de: 'Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail an stanislav&#64;1994live.de',
      en: 'If you have any questions about data protection, please send us an email at stanislav&#64;1994live.de',
      ru: 'Если у вас есть вопросы по защите данных, пожалуйста, напишите нам на электронную почту: stanislav&#64;1994live.de',
    },
  };
}
