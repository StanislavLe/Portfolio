import { Component, OnInit, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  currentSection = 'hero';
  isLastSection = false;

  @ViewChild('pager') pager!: SectionPagerComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nav: SectionNavService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.nav.setActive('hero');
    }

    this.nav.active$.subscribe(id => (this.currentSection = id));
    this.nav.isLast$.subscribe(v => (this.isLastSection = v));

    this.route.fragment.subscribe(f => {
      if (f) this.nav.requestScroll(f);
    });

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
    this.router.navigate([], {
      fragment: id,
      replaceUrl: true,
      queryParamsHandling: 'preserve'
    });
  }

  onNavigateSection(id: string) {
    this.nav.requestScroll(id);
  }
}
