import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SectionPagerComponent } from '../shared/section-pager/section-pager.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SectionPagerComponent],
  template: `
    <app-section-pager
      #pager
      [currentSection]="currentSection"
      (sectionChanged)="sectionChanged.emit($event)">
    </app-section-pager>
  `
})
export class HomeComponent implements OnInit {
  @Input() currentSection: string = 'hero';
  @Output() sectionChanged = new EventEmitter<string>();

  @ViewChild(SectionPagerComponent) pager!: SectionPagerComponent;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // QueryParam prüfen (z. B. ?section=skills)
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.currentSection = params['section'];
        // Falls Pager schon existiert, direkt scrollen
        setTimeout(() => this.scrollTo(this.currentSection), 100);
      }
    });
  }

  scrollTo(sectionId: string) {
    const idx = this.pager.sections.findIndex(s => s.id === sectionId);
    if (idx >= 0) {
      setTimeout(() => this.pager.scrollToSection(idx));
    }
  }
}
