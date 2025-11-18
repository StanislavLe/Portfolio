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
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, isPlatformBrowser } from '@angular/common';
import { SECTIONS, SectionNavService } from '../sections.config';
import { FooterComponent } from '../footer/footer.component';
import { HeroSectionComponent } from '../../hero-section/hero-section.component';
import { AboutMeComponent } from '../../about-me/about-me.component';
import { SkillsetComponent } from '../../skillset/skillset.component';
import { PortfolioComponent } from '../../portfolio/portfolio.component';
import { ReferencesComponent } from '../../references/references.component';
import { ContactMeComponent } from '../../contact-me/contact-me.component';
import { FEATURE_FLAGS } from '../../shared/sections.config';

/**
 * SectionPagerComponent
 * ----------------------
 *
 * Steuert das Scroll- und Navigationsverhalten zwischen den Hauptsektionen der Startseite.
 *
 * Features:
 * - Smooth Scrolling per Mausrad, Touch-Geste oder Dot-Navigation
 * - Echtzeit-Synchronisierung mit der aktiven Section über IntersectionObserver
 * - SSR-sicher durch `isPlatformBrowser`-Abfrage
 * - Integration mit globalem `SectionNavService`
 *
 * Jede sichtbare Section wird automatisch erkannt und in der Dot-Navigation hervorgehoben.
 */
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
export class SectionPagerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /** Liste aller definierten Inhaltssektionen (z. B. Hero, About, Skills, etc.) */
  sections = SECTIONS;

  /** DOM-Referenzen zu allen Sections im Template */
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;

  /** Aktuell aktive Section-ID, optional von außen gesetzt */
  @Input() currentSection: string = 'hero';

  /** Gibt das Event aus, wenn sich die aktive Section ändert */
  @Output() sectionChanged = new EventEmitter<string>();

  /** Wird ausgelöst, wenn externe Navigation (z. B. Footer-Link) erfolgt */
  @Output() navigateSection = new EventEmitter<string>();

  /** Aktueller Index der aktiven Section */
  currentSectionIndex = 0;

  /** Feature-Toggles für optionale Bereiche (z. B. References) */
  featureFlags = FEATURE_FLAGS;

  /** Scroll-Zustände */
  isScrolling = false;
  private scrollCooldown = false;
  private scrollDelay = 900;

  /** IntersectionObserver erkennt, welche Section sichtbar ist */
  private observer!: IntersectionObserver;

  /** True, sobald alle DOM-Elemente der Sections initialisiert wurden */
  private viewReady = false;

  /** Zwischenspeicher für Scroll-Anfragen, wenn View noch nicht geladen ist */
  private pendingScrollId: string | null = null;

  /**
   * Konstruktor
   *
   * - Integriert den globalen `SectionNavService`
   * - Ermöglicht manuelle Change Detection für OnPush
   * - Prüft Browserumgebung über `PLATFORM_ID`
   */
  constructor(
    private nav: SectionNavService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ---------------------------------------------------------------------------
  // 🧭 Lifecycle Hooks
  // ---------------------------------------------------------------------------

  /**
   * ngAfterViewInit
   * ----------------
   * Initialisiert den `IntersectionObserver`, um automatisch zu erkennen,
   * welche Section aktuell im Viewport sichtbar ist.
   * Nur im Browser aktiv (SSR-sicher).
   */
  ngAfterViewInit(): void {
    this.viewReady = true;

    // 🚫 Nur im Browser ausführen (verhindert SSR/Vite Fehler)
    if (!isPlatformBrowser(this.platformId)) return;

    // 🔍 IntersectionObserver initialisieren
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = this.sections.findIndex((s) => s.id === id);
            if (idx !== this.currentSectionIndex) {
              this.currentSectionIndex = idx;
              this.sectionChanged.emit(id);
              this.nav.setActive(id);
              this.cdr.markForCheck();
            }
          }
        }
      },
      { threshold: 0.5 } // Section gilt als aktiv, wenn 50 % sichtbar
    );

    // Alle Sections beobachten
    this.sectionRefs.forEach((ref) => this.observer.observe(ref.nativeElement));

    // Falls ein Scroll bereits vor ViewInit angefordert wurde → jetzt ausführen
    const idx = this.sections.findIndex((s) => s.id === this.currentSection);
    this.currentSectionIndex = idx >= 0 ? idx : 0;
    this.pendingScrollId = null;
    this.cdr.markForCheck();
  }

  /**
   * ngOnInit
   * ---------
   * Abonniert globale Scroll-Anfragen (z. B. von Footer oder Header Navigation).
   * Wenn View noch nicht geladen ist, wird die Anfrage zwischengespeichert.
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
   * ngOnChanges
   * ------------
   * Reagiert auf Änderungen der `currentSection` von außen.
   * Führt bei Bedarf ein Scroll zur neuen Section durch.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSection'] && this.viewReady) {
      const idx = this.sections.findIndex((s) => s.id === this.currentSection);
      if (idx >= 0 && idx !== this.currentSectionIndex) {
        this.scheduleScroll(idx);
      }
    }
  }

  /**
   * ngOnDestroy
   * ------------
   * Trennt den IntersectionObserver, um Speicherlecks zu verhindern.
   */
  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  // ---------------------------------------------------------------------------
  // 🖱️ Scroll- und Touchsteuerung
  // ---------------------------------------------------------------------------

  /**
   * Reagiert auf Mausrad-Scrolls.
   *
   * - Scrollt nur eine Section pro Radbewegung
   * - Verhindert übermäßiges Scrollen mit Cooldown
   */
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

  /** Y-Position des Touch-Starts (zum Erkennen von Swipe-Gesten) */
  private touchStartY = 0;

  /** Y-Position des Touch-Endes */
  private touchEndY = 0;

  /** Minimaler Swipe-Abstand in Pixeln, um als gültige Geste zu zählen */
  private swipeThreshold = 50;

  /** Speichert die Startposition eines Touch-Events */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  /** Verarbeitet das Ende einer Touch-Geste und wertet die Richtung aus */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  /**
   * Ermittelt die Swipe-Richtung und navigiert zur nächsten/vorherigen Section.
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
  // 🧩 Scroll-Logik
  // ---------------------------------------------------------------------------

  /**
   * Plant das Scrollen asynchron (Microtask), um sicherzustellen,
   * dass DOM und Change Detection stabil sind.
   */
  private scheduleScroll(idx: number): void {
    queueMicrotask(() => this.scrollToSection(idx));
  }

  /**
   * Scrollt zur angegebenen Section.
   *
   * - Scrollt sanft per `scrollIntoView`
   * - Aktualisiert die aktive Section
   * - Synchronisiert Navigation und Observer
   */
  scrollToSection(index: number): void {
    const el = this.sectionRefs.get(index)?.nativeElement;
    if (!el) return;

    const id = this.sections[index].id;
    this.currentSectionIndex = index;
    this.sectionChanged.emit(id);
    this.nav.setActive(id);

    el.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => this.cdr.detectChanges(), 300);
  }

  /**
   * Wird aufgerufen, wenn externe Navigation (z. B. Footer) ausgelöst wird.
   * Fordert Scroll über den SectionNavService an.
   */
  onNavigateSection(id: string): void {
    this.nav.requestScroll(id);
  }
}
