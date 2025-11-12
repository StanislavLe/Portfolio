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
  currentSection = 'hero';
  isLastSection = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nav: SectionNavService,
    @Inject(DOCUMENT) private document: Document,
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

    // 🧭 Handle scroll requests from Header/Hero
    this.nav.scrollTo$.subscribe((id) => this.scrollToSection(id));
  }

  private scrollToSection(id: string) {
    const target = this.document.querySelector(`#${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.nav.setActive(id);
    }
  }

  onNavigateSection(id: string) {
    this.nav.requestScroll(id);
  }
}
