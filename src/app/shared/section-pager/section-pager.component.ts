import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, HostListener, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

// Zentrale Config
import { SECTIONS } from '../sections.config';

// Deine Section Components (alle Standalone!)
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
    ContactMeComponent
  ],
  templateUrl: './section-pager.component.html',
  styleUrl: './section-pager.component.scss'
})
export class SectionPagerComponent implements AfterViewInit, OnChanges {
  sections = SECTIONS;

  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;
  @Input() currentSection: string = 'hero';
  @Output() sectionChanged = new EventEmitter<string>();

  currentSectionIndex = 0;
  isScrolling = false;

  ngAfterViewInit() {
    const idx = this.sections.findIndex(s => s.id === this.currentSection);
    if (idx >= 0) {
      setTimeout(() => this.scrollToSection(idx));
    } else {
      setTimeout(() => this.scrollToSection(0));
    }
  }


 ngOnChanges(changes: SimpleChanges) {
  if (changes['currentSection']) {
    const idx = this.sections.findIndex(s => s.id === this.currentSection);
    if (idx >= 0 && idx !== this.currentSectionIndex) {
      if (this.sectionRefs && this.sectionRefs.length > 0) {
        this.scrollToSection(idx);
      } else {
        // Falls noch nicht gerendert: nachträglich scrollen
        setTimeout(() => {
          if (this.sectionRefs && this.sectionRefs.length > 0) {
            this.scrollToSection(idx);
          }
        });
      }
    }
  }
}




  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.isScrolling) return;
    if (event.deltaY > 0 && this.currentSectionIndex < this.sections.length - 1) {
      this.scrollToSection(this.currentSectionIndex + 1);
      event.preventDefault();
    } else if (event.deltaY < 0 && this.currentSectionIndex > 0) {
      this.scrollToSection(this.currentSectionIndex - 1);
      event.preventDefault();
    }
  }

  scrollToSection(index: number) {
    if (this.isScrolling) return;
    this.isScrolling = true;

    const el = this.sectionRefs.get(index)?.nativeElement;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    this.currentSectionIndex = index;
    this.sectionChanged.emit(this.sections[index].id);

    setTimeout(() => this.isScrolling = false, 700);
  }

}
