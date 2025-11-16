/**
 * SectionPagerComponent
 * ----------------------
 *
 * Diese Komponente steuert das Scroll-Verhalten zwischen den verschiedenen
 * Inhaltssektionen der Startseite (Hero, About, Skills, Portfolio, References, Contact).
 * 
 * Sie stellt sicher, dass:
 * - zwischen Sections per Scroll, Touch oder Swipe navigiert werden kann
 * - die aktive Section synchron mit dem `SectionNavService` aktualisiert wird
 * - gezielte Sprünge zu bestimmten Abschnitten (z. B. durch Footer/Header-Navigation) möglich sind
 *
 * Features:
 * - Smooth Scrolling mit Maus oder Touch-Gesten
 * - Synchronisierung mit der globalen Navigationslogik (`SectionNavService`)
 * - Unterstützung für asynchrone Section-Initialisierung (Lazy DOM readiness)
 * - ChangeDetection optimiert via `OnPush`
 */

import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  HostListener,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { SECTIONS, SectionNavService } from '../sections.config';
import { FooterComponent } from '../footer/footer.component';
import { HeroSectionComponent } from '../../hero-section/hero-section.component';
import { AboutMeComponent } from '../../about-me/about-me.component';
import { SkillsetComponent } from '../../skillset/skillset.component';
import { PortfolioComponent } from '../../portfolio/portfolio.component';
import { ReferencesComponent } from '../../references/references.component';
import { ContactMeComponent } from '../../contact-me/contact-me.component';
import { FEATURE_FLAGS } from '../../shared/sections.config';

@Component({
  selector: 'app-section-pager',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    HeroSectionComponent,
    AboutMeComponent,
    SkillsetComponent,
    PortfolioComponent,
    ReferencesComponent,
    ContactMeComponent,
    FooterComponent,
  ],
  templateUrl: './section-pager.component.html',
  styleUrls: ['./section-pager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionPagerComponent implements OnInit, AfterViewInit, OnChanges {

  /**
   * Liste aller verfügbaren Inhaltssektionen.
   * Wird aus der zentralen Konfiguration (`sections.config.ts`) importiert.
   */
  sections = SECTIONS;

  /**
   * Referenzen auf DOM-Elemente der einzelnen Sections.
   * Ermöglicht gezieltes Scrolling über `scrollIntoView`.
   */
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;

  /**
   * ID der aktuell aktiven Section (z. B. "hero", "about", "contact").
   * Wird als Input vom übergeordneten Component übergeben (z. B. HomeComponent).
   */
  @Input() currentSection: string = 'hero';

  /**
   * EventEmitter, der ausgelöst wird, wenn sich die aktive Section ändert.
   * Wird von der Elternkomponente genutzt, um UI-Zustände zu aktualisieren.
   */
  @Output() sectionChanged = new EventEmitter<string>();

  /**
   * EventEmitter zur Weitergabe von Navigationsanfragen an andere Komponenten (z. B. Footer).
   */
  @Output() navigateSection = new EventEmitter<string>();

  /** Interner Index der aktuell aktiven Section. */
  currentSectionIndex = 0;


  featureFlags = FEATURE_FLAGS;

  /** Flag, das verhindert, dass mehrere Scrolls gleichzeitig ausgeführt werden. */
  isScrolling = false;

  /** Y-Koordinate des Touchstarts (zum Erkennen von Swipe-Richtung). */
  private touchStartY = 0;

  /** Y-Koordinate des Touchendes. */
  private touchEndY = 0;

  /** Minimaler Swipe-Abstand in Pixeln, um als gültige Geste zu gelten. */
  private swipeThreshold = 50;

  /** Ob alle View-Elemente geladen und bereit sind. */
  private viewReady = false;

  /** Temporärer Speicher für Scroll-Anfragen, bevor das View initialisiert ist. */
  private pendingScrollId: string | null = null;

  /**
   * Konstruktor
   * 
   * @param nav - Globaler Navigationsservice zur Synchronisierung aktiver Sections.
   * @param cdr - ChangeDetectorRef für manuelles Triggern von Change Detection bei OnPush.
   */
  constructor(private nav: SectionNavService, private cdr: ChangeDetectorRef) { }

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Initialisiert die Beobachtung von Scroll-Anfragen (via `scrollTo$` im SectionNavService).
   * 
   * Wenn eine Anfrage kommt, bevor die View bereit ist, wird sie zwischengespeichert
   * und nach `AfterViewInit` ausgeführt.
   */
  ngOnInit(): void {
    this.nav.scrollTo$.subscribe((id) => {
      if (!this.viewReady) {
        this.pendingScrollId = id;
        return;
      }
      const idx = this.sections.findIndex((s) => s.id === id);
      if (idx >= 0) this.scheduleScroll(idx);
    });
  }

  /**
   * Lifecycle Hook – `ngAfterViewInit`
   *
   * Wird nach der Initialisierung aller DOM-Elemente aufgerufen.
   * 
   * Setzt den aktuellen Section-Index und führt ggf. ein zuvor ausstehendes Scroll-Event aus.
   */
  ngAfterViewInit(): void {
    this.viewReady = true;
    const idx = this.sections.findIndex((s) => s.id === this.currentSection);
    this.currentSectionIndex = idx >= 0 ? idx : 0;
    this.pendingScrollId = null;
    this.cdr.markForCheck();
  }

  /**
   * Lifecycle Hook – `ngOnChanges`
   *
   * Wird ausgelöst, wenn sich die `currentSection` von außen ändert.
   * 
   * Erkennt Änderungen und führt (wenn nötig) automatisches Scrollen
   * zur entsprechenden Section durch.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSection'] && this.viewReady) {
      const idx = this.sections.findIndex((s) => s.id === this.currentSection);
      if (idx >= 0 && idx !== this.currentSectionIndex) {
        if (this.sectionRefs?.length > 0) {
          this.scheduleScroll(idx);
        } else {
          setTimeout(() => {
            if (this.sectionRefs?.length > 0) this.scheduleScroll(idx);
          });
        }
      }
    }
  }

  /**
   * Plant das Scrollen zur angegebenen Section ein.
   * 
   * Wird als Microtask ausgeführt, um DOM-Stabilität sicherzustellen.
   */
  private scheduleScroll(idx: number): void {
    queueMicrotask(() => this.scrollToSection(idx));
  }

  // ---------------------------------------------------------------------------
  // Scroll- & Touch-Event Handling (Ein-Section-pro-Scroll, stabil)
  // ---------------------------------------------------------------------------

  /**
   * 🖱️ Scroll-Verhalten:
   * --------------------
   * - Egal wie stark oder oft das Mausrad betätigt wird:
   *   ➜ Es wird **immer nur eine Section** pro Scrollbewegung gewechselt.
   * - Nach jedem Scroll gibt es eine kurze Pause (cooldown),
   *   damit keine Mehrfach-Scrolls auftreten.
   */

  private scrollCooldown = false; 
  private scrollDelay = 900; 

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (this.scrollCooldown || this.isScrolling) return;
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = this.currentSectionIndex + direction;
    if (nextIndex < 0 || nextIndex >= this.sections.length) return;
    this.isScrolling = true;
    this.scrollCooldown = true;
    this.scrollToSection(nextIndex); 
    setTimeout(() => {
      this.scrollCooldown = false;
      this.isScrolling = false;
    }, this.scrollDelay);
  }


  /**
   * Speichert die Startposition bei einer Touch-Geste.
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  /**
   * Speichert die Endposition einer Touch-Geste und wertet den Swipe aus.
   */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  /**
   * Ermittelt, ob eine gültige Swipe-Geste erkannt wurde (nach oben/unten).
   * Navigiert entsprechend zwischen den Sections.
   */
  private handleSwipe(): void {
    if (this.isScrolling) return;
    const deltaY = this.touchStartY - this.touchEndY;
    if (Math.abs(deltaY) > this.swipeThreshold) {
      if (deltaY > 0 && this.currentSectionIndex < this.sections.length - 1) {
        this.scheduleScroll(this.currentSectionIndex + 1);
      } else if (deltaY < 0 && this.currentSectionIndex > 0) {
        this.scheduleScroll(this.currentSectionIndex - 1);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Core Scroll Logic
  // ---------------------------------------------------------------------------

  /**
   * Führt das eigentliche Scrollen zur angegebenen Section aus.
   * 
   * @param index - Index der Zielsektion in der `sections`-Liste.
   * 
   * - Scrollt sanft mit `scrollIntoView`
   * - Aktualisiert den aktiven Zustand im `SectionNavService`
   * - Löst `sectionChanged` Event für Elternkomponenten aus
   */
  scrollToSection(index: number): void {
    const el = this.sectionRefs.get(index)?.nativeElement;
    if (!el) return;

    // 🎨 Aktive Section sofort setzen (Header-Update erfolgt direkt)
    this.currentSectionIndex = index;
    const id = this.sections[index].id;
    this.sectionChanged.emit(id);
    this.nav.setActive(id); // <- sofort Header-Farbe updaten

    // Danach das eigentliche Scrollen starten
    el.scrollIntoView({ behavior: 'smooth' });

    // Optional leichte Verzögerung zur visuellen Synchronität
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 200);
  }



  /**
   * Öffentliche Methode für externe Navigationsaufrufe.
   * 
   * Wird z. B. vom Footer oder Header verwendet, um gezielt zu einer Section zu scrollen.
   */
  onNavigateSection(id: string): void {
    this.nav.requestScroll(id);
  }
}
