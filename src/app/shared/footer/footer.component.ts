/**
 * FooterComponent
 * ----------------
 *
 * Diese Komponente stellt den globalen Footer der Anwendung dar.
 * 
 * Sie dient gleichzeitig als Navigations- und Sprachanzeigeelement
 * für verschiedene Seitenvarianten (Startseite, Impressum, Datenschutz etc.).
 *
 * Hauptfunktionen:
 * - Mehrsprachige Anzeige der Footer-Inhalte über den `LanguageService`
 * - Dynamische Layout-Varianten via `@Input() variant`
 * - Steuerung von Routenwechseln und sanftem Scroll-Verhalten
 * - Unterstützung der Section-Navigation auf der Startseite
 */

import {
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  PLATFORM_ID,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SectionNavService } from '../sections.config';
import { LanguageService, SupportedLang } from '../language.service';

/**
 * Typdefinition für die verschiedenen Varianten des Footers.
 * 
 * - `home`      → Standard-Footer auf der Startseite
 * - `legal`     → Footer auf rechtlichen Seiten (z. B. Impressum, Datenschutz)
 * - `contact`   → Footer auf der Kontaktseite
 * - `impressum` → Footer auf der Impressum-Seite
 * - `privacy`   → Footer auf der Datenschutz-Seite
 */
type FooterVariant = 'home' | 'legal' | 'contact' | 'impressum' | 'privacy';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  /**
   * Legt fest, welche Variante des Footers angezeigt wird.
   * Wird vom übergeordneten Component (z. B. Home, Legal, Impressum) gesetzt.
   */
  @Input() variant: FooterVariant = 'home';

  /**
   * EventEmitter zur Navigation zwischen Sections
   * (z. B. vom Footer zur "Contact"-Sektion auf der Startseite).
   */
  @Output() navigateSection = new EventEmitter<string>();

  /**
   * Aktuell aktive Sprache (Standard: Deutsch).
   * Wird reaktiv über den LanguageService aktualisiert.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Dynamisch berechnetes Jahr (für Copyright-Anzeige).
   */
  currentYear = new Date().getFullYear();

  /**
   * Mehrsprachige Übersetzungen der Footer-Elemente.
   * 
   * Struktur:
   * - Jeder Schlüssel (z. B. `impressum`, `privacy`) enthält Übersetzungen in drei Sprachen.
   * - Die Texte werden im Template basierend auf `currentLang` dynamisch gerendert.
   */
  translations = {
    home: {
      de: 'Start',
      en: 'Home',
      ru: 'Главная',
    },
    impressum: {
      de: 'Impressum',
      en: 'Legal Notice',
      ru: 'Импрессум',
    },
    privacy: {
      de: 'Datenschutz',
      en: 'Privacy Policy',
      ru: 'Данные',
    },
    linkedin: {
      de: 'LinkedIn',
      en: 'LinkedIn',
      ru: 'Линкедин',
    },
    github: {
      de: 'GitHub',
      en: 'GitHub',
      ru: 'ГитХаб',
    },
    copyright: {
      de: '© {{year}} Stanislav Levin',
      en: '© {{year}} Stanislav Levin',
      ru: '© {{year}} Станислав Левин',
    },
  };

  /**
   * Konstruktor
   * 
   * Injiziert Router, NavigationService und Sprachverwaltung.
   * 
   * @param router - Angular Router zur Navigation zwischen Routen.
   * @param nav - SectionNavService für die Steuerung von Abschnitten auf der Startseite.
   * @param langService - Globaler Sprachservice, der Sprachänderungen bereitstellt.
   * @param cdr - ChangeDetectorRef, um nach Sprachänderungen eine manuelle Aktualisierung zu erzwingen.
   * @param platformId - Dient zur Abfrage, ob Code im Browser oder Server ausgeführt wird.
   * @param document - Referenz auf das globale Dokumentobjekt (DOM-Manipulation).
   */
  constructor(
    private router: Router,
    private nav: SectionNavService,
    private langService: LanguageService,
    private cdr: ChangeDetectorRef, 
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   * 
   * Aufgaben:
   * - Abonniert Sprachänderungen aus dem LanguageService.
   * - Erzwingt bei jeder Änderung eine UI-Aktualisierung über Change Detection.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  /**
   * Führt eine Navigation aus und scrollt danach sanft an den Seitenanfang.
   * 
   * @param path - Array aus Routen-Fragmenten (z. B. `['/impressum']` oder `['/']`).
   * 
   * Verhalten:
   * - Navigiert per Angular Router zum angegebenen Pfad.
   * - Scrollt anschließend die Seite nach oben (nur im Browser).
   * - Falls Ziel die Startseite ist, aktiviert zusätzlich die „hero“-Section
   *   und synchronisiert sie mit dem SectionNavService.
   */
  navigateAndScroll(path: string[]): void {
    const target = path.join('/');
    const isHome = target === '/' || target === '';

    this.router.navigate(path).then((success) => {
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
}
