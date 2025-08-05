import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, HostListener, Output, EventEmitter } from '@angular/core';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';

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
export class SectionPagerComponent implements AfterViewInit {
  sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About Me' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'references', label: 'References' },
    { id: 'contact', label: 'Contact' }
  ];

  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef>;
  currentSectionIndex = 0;
  isScrolling = false;

  @Output() sectionChanged = new EventEmitter<string>();

  ngAfterViewInit() {
    this.scrollToSection(0);
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
    const el = this.sectionRefs.get(index)?.nativeElement;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.currentSectionIndex = index;
    this.sectionChanged.emit(this.sections[index].id);
    setTimeout(() => this.isScrolling = false, 700);
  }
}
