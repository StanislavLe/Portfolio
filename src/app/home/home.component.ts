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
  ) {}

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
   * Lifecycle-Hook: Nach der Initialisierung der View.
   * 
   * - Initialisiert IntersectionObserver, um die aktive Sektion beim Scrollen zu erkennen
   * - Beobachtet alle <section>-Elemente im DOM
   * - Scrollt zu Sektionen, wenn sie über den SectionNavService angefordert werden
   */
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sections = this.document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) this.nav.setActive(id);
          }
        }
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    this.nav.scrollTo$.subscribe((id) => this.scrollToSection(id));
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
