import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SectionPagerComponent } from '../shared/section-pager/section-pager.component';
import { SectionNavService } from '../shared/sections.config';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SectionPagerComponent],
  template: `
    <app-header
      variant="home"
      [currentSection]="currentSection"
      (navigateSection)="onNavigateSection($event)">
    </app-header>

    <app-section-pager
      #pager
      [currentSection]="currentSection"
      (sectionChanged)="onSectionChanged($event)">
    </app-section-pager>

    <app-footer
      *ngIf="isLastSection"
      variant="home"
      (navigateSection)="onNavigateSection($event)">
    </app-footer>
  `,
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentSection = 'hero';
  isLastSection = false;

  @ViewChild('pager') pager!: SectionPagerComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nav: SectionNavService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.nav.setActive('hero');
      this.nav.requestScroll('hero');
    }

    this.nav.active$.subscribe(id => this.currentSection = id);
    this.nav.isLast$.subscribe(v => this.isLastSection = v);

    this.route.fragment.subscribe(f => { if (f) this.nav.requestScroll(f); });
    this.route.queryParamMap.subscribe(p => {
      const s = p.get('section');
      if (s) this.nav.requestScroll(s);
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.nav.requestScroll('hero');
    }
  }

  onSectionChanged(id: string) {
    this.currentSection = id;
    this.router.navigate([], { fragment: id, replaceUrl: true, queryParamsHandling: 'preserve' });
  }

  onNavigateSection(id: string) {
    this.nav.requestScroll(id);
  }
}
