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

import { HeroSectionComponent } from '../../hero-section/hero-section.component';
import { AboutMeComponent } from '../../about-me/about-me.component';
import { SkillsetComponent } from '../../skillset/skillset.component';
import { PortfolioComponent } from '../../portfolio/portfolio.component';
import { ReferencesComponent } from '../../references/references.component';
import { ContactMeComponent } from '../../contact-me/contact-me.component';

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
  ],
  templateUrl: './section-pager.component.html',
  styleUrls: ['./section-pager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionPagerComponent implements OnInit, AfterViewInit, OnChanges {
  sections = SECTIONS;

  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;
  @Input() currentSection: string = 'hero';
  @Output() sectionChanged = new EventEmitter<string>();

  currentSectionIndex = 0;
  isScrolling = false;

  private touchStartY = 0;
  private touchEndY = 0;
  private swipeThreshold = 50;

  // NEW: init orchestration
  private viewReady = false;
  private pendingScrollId: string | null = null;

  constructor(private nav: SectionNavService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Header/Footer → Scroll-Wünsche
    this.nav.scrollTo$.subscribe((id) => {
      // Wenn View noch nicht fertig, später ausführen
      if (!this.viewReady) {
        this.pendingScrollId = id;
        return;
      }
      const idx = this.sections.findIndex((s) => s.id === id);
      if (idx >= 0) this.scheduleScroll(idx);
    });
  }

  ngAfterViewInit() {
    this.viewReady = true;

    // initial target ermitteln
    const idx = this.sections.findIndex((s) => s.id === this.currentSection);
    const targetIdx = idx >= 0 ? idx : 0;

    // Falls ein pending Scroll aus ngOnInit kam, den bevorzugen
    const pendingIdx =
      this.pendingScrollId != null
        ? this.sections.findIndex((s) => s.id === this.pendingScrollId)
        : -1;

    const finalIdx = pendingIdx >= 0 ? pendingIdx : targetIdx;

    // WICHTIG: in eine Microtask schieben, damit der erste CD-Zyklus fertig ist
    queueMicrotask(() => {
      this.scrollToSection(finalIdx);
      this.pendingScrollId = null;
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSection'] && this.viewReady) {
      const idx = this.sections.findIndex((s) => s.id === this.currentSection);
      if (idx >= 0 && idx !== this.currentSectionIndex) {
        if (this.sectionRefs?.length > 0) {
          this.scheduleScroll(idx);
        } else {
          // sicherheitshalber verzögern
          setTimeout(() => {
            if (this.sectionRefs?.length > 0) this.scheduleScroll(idx);
          });
        }
      }
    }
  }

  private scheduleScroll(idx: number) {
    // kleine Entkopplung vom aktuellen Zyklus
    queueMicrotask(() => this.scrollToSection(idx));
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.isScrolling) return;
    if (event.deltaY > 0 && this.currentSectionIndex < this.sections.length - 1) {
      this.scheduleScroll(this.currentSectionIndex + 1);
      event.preventDefault();
    } else if (event.deltaY < 0 && this.currentSectionIndex > 0) {
      this.scheduleScroll(this.currentSectionIndex - 1);
      event.preventDefault();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  private handleSwipe() {
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

  scrollToSection(index: number) {
    if (this.isScrolling) return;
    this.isScrolling = true;

    const el = this.sectionRefs.get(index)?.nativeElement;
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    // State-Updates (Klassenzustände) entkoppeln
    setTimeout(() => {
      this.currentSectionIndex = index;

      const id = this.sections[index].id;
      this.sectionChanged.emit(id);
      this.nav.setActive(id);
      this.nav.setIsLast(index === this.sections.length - 1);

      this.isScrolling = false;
      this.cdr.markForCheck();
    }, 0);
  }
}
