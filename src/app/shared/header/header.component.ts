/**
 * HeaderComponent
 * ----------------
 *
 * Diese Komponente stellt den globalen Header der Anwendung dar.
 * 
 * Sie dient zur:
 * - Navigation zwischen Sektionen oder Seiten
 * - Steuerung des Sprachwechsels
 * - Steuerung des Drawer-Menüs (Mobile Navigation)
 * - Dynamischen Anpassung des Layout-Themes basierend auf der aktiven Section
 *
 * Der Header ist in zwei Varianten verwendbar:
 * - `home`  → dynamisch, interaktiv, reagiert auf Scroll/Sections
 * - `legal` → statisch, für rechtliche Seiten (z. B. Impressum, Datenschutz)
 */

import { Component, Input, OnInit, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService, SupportedLang } from '../language.service';
import { SECTIONS_TRANSLATIONS, SectionNavService } from '../sections.config';

/**
 * Definiert mögliche Layout-Varianten des Headers.
 *
 * - `home`  → Hauptseite mit dynamischer Section-Steuerung
 * - `legal` → Statische Variante für rechtliche Seiten
 */
type Variant = 'home' | 'legal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  /**
   * Aktuelle Layout-Variante des Headers (`home` oder `legal`).
   * 
   * Wird von der Elternkomponente gesetzt, um das Verhalten anzupassen.
   */
  @Input() variant: Variant = 'home';

  /**
   * ID der aktuell aktiven Section (z. B. `hero`, `about`, `contact`).
   * Wird vom `SectionNavService` gesetzt.
   */
  currentSection = 'hero';

  /**
   * Aktuell ausgewählte Sprache (Standard: Deutsch).
   * Wird durch den `LanguageService` reaktiv aktualisiert.
   */
  currentLanguage: SupportedLang = 'de';

  /**
   * Verhindert mehrfaches Auslösen der Sprachumschaltung bei schneller Klickfolge.
   */
  justClicked = false;

  /**
   * Zustand des mobilen Drawers (Menüs).
   * `true` → geöffnet, `false` → geschlossen.
   */
  drawerOpen = false;

  /**
   * CSS-Klasse zur dynamischen Anpassung des Themes.
   * Wird basierend auf der aktiven Section gesetzt.
   */
  themeClass = 'hero';

  /**
   * Sprachabhängige Übersetzungen der Section-Namen (für das Menü).
   */
  sections = SECTIONS_TRANSLATIONS['de'];

  /**
   * Allgemeine statische Übersetzungen für Menütexte, Buttons und Labels.
   */
  translations = {
    menu: { de: 'Menü', en: 'Menu', ru: 'Меню' },
    start: { de: 'Start', en: 'Home', ru: 'Главная' },
    impressum: { de: 'Impressum', en: 'Legal Notice', ru: 'Импрессум' },
    privacy: { de: 'Datenschutz', en: 'Privacy Policy', ru: 'Конфиденциальность' },
    name: { de: 'Stanislav Levin', en: 'Stanislav Levin', ru: 'Станислав Левин' },
  };

  /**
   * Konstruktor
   * 
   * Injiziert Router, Navigations- und Sprachservices sowie Browser-/DOM-Abhängigkeiten.
   *
   * @param router - Angular Router zum Navigieren zwischen Seiten.
   * @param nav - SectionNavService zur Steuerung der aktiven Sektionen (nur `home`-Variante).
   * @param platformId - Dient zur Erkennung, ob Code im Browser oder auf dem Server ausgeführt wird.
   * @param document - Direkter Zugriff auf das DOM-Dokument (für Scroll-Steuerung).
   * @param langService - Globaler Sprachservice zur Verwaltung der aktiven Sprache.
   */
  constructor(
    private router: Router,
    private nav: SectionNavService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private langService: LanguageService
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   * 
   * Aufgaben:
   * - Initialisiert Sprachabhängigkeiten.
   * - Abonniert den `SectionNavService`, um aktive Sektionen zu verfolgen.
   * - Setzt Theme-Klassen dynamisch in Abhängigkeit zur aktiven Section.
   */
  ngOnInit(): void {
    // Sprache initialisieren
    this.langService.lang$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.sections = SECTIONS_TRANSLATIONS[lang];
    });

    // Dynamische Headerfarbe auf der Startseite
    if (this.variant === 'home') {
      this.nav.active$.subscribe((id) => {
        this.currentSection = id;
        this.themeClass = id;
      });
    }

    // Statisches Theme für rechtliche Seiten
    if (this.variant === 'legal') {
      this.themeClass = 'legal';
    }
  }

  /**
   * Öffnet oder schließt das mobile Menü.
   * 
   * @param force - Optional: Erzwingt einen bestimmten Zustand (`true` = öffnen, `false` = schließen).
   */
  toggleDrawer(force?: boolean): void {
    this.drawerOpen = force ?? !this.drawerOpen;
  }

  /**
   * Navigiert zu einer Section oder zur Startseite.
   * 
   * @param id - ID der Zielsektion (z. B. `about`, `contact`).
   * 
   * Verhalten:
   * - Wenn `variant` = `home`: Scrollt zu entsprechender Section.
   * - Wenn `variant` = `legal`: Navigiert zur Startseite und scrollt nach oben.
   */
  navigateTo(id: string): void {
    if (this.variant === 'home') {
      this.nav.requestScroll(id);
    } else {
      this.navigateAndScroll(['/']);
    }
    this.toggleDrawer(false);
  }

  /**
   * Zyklischer Wechsel zwischen verfügbaren Sprachen (de → en → ru → de …).
   * 
   * Enthält einen kleinen Schutz vor zu schnellem Doppelklick.
   */
  cycleLanguage(): void {
    this.justClicked = true;
    setTimeout(() => (this.justClicked = false), 150);

    const langs: SupportedLang[] = ['de', 'en', 'ru'];
    const next = langs[(langs.indexOf(this.currentLanguage) + 1) % langs.length];
    this.langService.setLang(next);
  }

  /**
   * Führt eine Navigation zu einer bestimmten Route aus und scrollt anschließend an den Seitenanfang.
   * 
   * @param path - Zielroute als Array (z. B. `['/']` oder `['/impressum']`).
   */
  navigateAndScroll(path: string[]): void {
    this.router.navigate(path).then((success) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        requestAnimationFrame(() => win.scrollTo({ top: 0, behavior: 'auto' }));
      }
      this.toggleDrawer(false);
    });
  }

  /**
   * Gibt das aktuell passende Menü-Icon zurück (abhängig von Theme und Variante).
   * 
   * - `legal` → Weißes Icon
   * - `about`, `portfolio` → Schwarzes Icon
   * - Sonst → Weißes Icon (Standard)
   */
  get menuIcon(): string {
    if (this.variant === 'legal') {
      return 'assets/icons/menuWhite.png';
    }

    switch (this.themeClass) {
      case 'about':
      case 'portfolio':
        return 'assets/icons/menuBlack.png';
      case 'references':
      case 'hero':
      case 'skills':
      case 'contact':
      default:
        return 'assets/icons/menuWhite.png';
    }
  }
}
