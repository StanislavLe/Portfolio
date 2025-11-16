/**
 * HomeComponent
 * --------------
 * Haupt-Startseite der Anwendung.
 * 
 * Diese Komponente:
 * - Steuert den sichtbaren Abschnitt (hero, about, contact, etc.)
 * - Verwaltet das Scrollverhalten zwischen Sektionen
 * - Synchronisiert den Header und den SectionPager mit der aktuellen View
 * 
 * Importiert:
 * - HeaderComponent, FooterComponent, SectionPagerComponent
 * - SectionNavService für Navigation & Statusverwaltung
 */

import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SectionPagerComponent } from '../shared/section-pager/section-pager.component';
import { SectionNavService } from '../shared/sections.config';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SectionPagerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  /**
   * ID des aktuell aktiven Abschnitts (z. B. "hero", "about", "contact")
   * Wird von SectionNavService aktualisiert.
   */
  currentSection = 'hero';

  /**
   * Gibt an, ob der aktuelle Abschnitt der letzte ist.
   * Wird genutzt, um Navigation oder Scroll-Indikatoren anzupassen.
   */
  isLastSection = false;

  /**
   * Konstruktor injiziert Router, Route und Navigations-Service.
   * 
   * @param route - Aktivierte Route für Fragment- und QueryParam-Abfragen
   * @param router - Angular Router zum Navigieren
   * @param nav - SectionNavService zur Kommunikation zwischen Komponenten
   * @param document - Browser-Dokumentobjekt (wird injiziert für SSR-Kompatibilität)
   * @param platformId - Plattform-ID für Browser-/Serverdifferenzierung
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nav: SectionNavService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
   * Lifecycle-Hook: Initialisierung.
   * 
   * - Setzt initial den aktiven Abschnitt ("hero")
   * - Abonniert SectionNavService für:
   *   - aktive Sektion (active$)
   *   - Status, ob letzte Sektion aktiv ist (isLast$)
   * - Reagiert auf URL-Fragmente und QueryParams, um gezielt zu scrollen
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.nav.setActive('hero');
    }

    this.nav.active$.subscribe(id => (this.currentSection = id));
    this.nav.isLast$.subscribe(v => (this.isLastSection = v));

    // Scrollen über #fragment in der URL
    this.route.fragment.subscribe(fragment => {
      if (fragment) this.nav.requestScroll(fragment);
    });

    // Scrollen über QueryParam (?section=about)
    this.route.queryParamMap.subscribe(params => {
      const section = params.get('section');
      if (section) this.nav.requestScroll(section);
    });
  }

  /**
   * Lifecycle-Hook – `ngAfterViewInit`
   * ----------------------------------
   *
   * Wird nach der Initialisierung der View aufgerufen und sorgt dafür,
   * dass die aktuelle sichtbare Sektion (z. B. *hero*, *about*, *contact*) 
   * zuverlässig erkannt und synchron mit der globalen Navigation (`SectionNavService`) gehalten wird.
   *
   * Hauptaufgaben:
   * 1. Initialisiert den `IntersectionObserver`, um dynamisch zu erkennen,
   *    welche Sektion gerade im Viewport sichtbar ist.
   * 2. Reagiert auf Scrollbefehle aus dem `SectionNavService` (z. B. Klick im Header/Footer).
   * 3. Führt nach dem Laden eine Sichtbarkeitsprüfung aus, um die korrekte aktive Section zu setzen.
   *
   * ⚙️ Funktionsweise:
   * - Beobachtet alle `<div>`-Elemente mit einer `id` (jede Page-Section).
   * - Sobald eine Section zu mindestens 50 % sichtbar ist (`threshold: 0.5`),
   *   wird deren ID an den Navigationsservice übergeben.
   * - Nach dem Laden prüft eine kurze Verzögerung (300 ms), 
   *   welche Section initial sichtbar ist (z. B. bei Zurücknavigation oder Browser-Refresh).
   */
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const sections = Array.from(this.document.querySelectorAll<HTMLElement>('div[id]'));
    const observer = new IntersectionObserver(
      (entries) =>
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => this.nav.setActive(entry.target.id)),
      { threshold: 0.5 }
    );
    sections.forEach((section) => observer.observe(section));
    this.nav.scrollTo$.subscribe((id) => this.scrollToSection(id));
    setTimeout(() => this.detectVisibleSection(sections), 300);
  }

  /**
   * Hilfsmethode: `detectVisibleSection`
   * ------------------------------------
   *
   * Prüft, welche Section aktuell im sichtbaren Bereich (Viewport)
   * liegt und setzt diese als aktive Section im `SectionNavService`.
   *
   * Wird einmalig beim Laden der View ausgeführt (nach 300 ms Verzögerung),
   * um den Zustand der aktuell sichtbaren Section korrekt zu initialisieren.
   *
   * @param sections - Liste aller DOM-Elemente mit einer Section-ID (z. B. `hero`, `about`, `contact`)
   *
   * 🔍 Funktionsweise:
   * - Eine Section gilt als sichtbar, wenn ihr mittlerer Bereich
   *   innerhalb von 40–60 % der Fensterhöhe liegt.
   * - Wenn keine Section erkannt wird, wird standardmäßig `'hero'` gesetzt.
   */
  private detectVisibleSection(sections: HTMLElement[]): void {
    const visible = sections.find((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top < innerHeight * 0.6 && rect.bottom > innerHeight * 0.4;
    });
    this.nav.setActive(visible?.id || 'hero');
  }


  /**
   * Scrollt sanft zu einer bestimmten Sektion anhand der ID.
   * 
   * @param id - ID der Zielsektion (z. B. "contact")
   */
  private scrollToSection(id: string): void {
    const target = this.document.querySelector<HTMLElement>(`#${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.nav.setActive(id);
    }
  }

  /**
   * Handler für manuelle Navigation über Header oder Pager.
   * 
   * @param id - Zielsektion, zu der navigiert werden soll
   */
  onNavigateSection(id: string): void {
    this.nav.requestScroll(id);
  }
}
