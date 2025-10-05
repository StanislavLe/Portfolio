import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SECTIONS } from '../sections.config';

type Variant = 'home' | 'legal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnChanges {
  @Input() variant: Variant = 'home';
  @Input() currentSection: string = 'hero';
  @Input() currentLanguage: string = 'de';
  @Input() justClicked = false;
  @Output() navigateSection = new EventEmitter<string>();
  @ViewChild('sidenav') sidenav!: MatSidenav;

  sections = SECTIONS;
  themeClass = 'hero';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnChanges(_: SimpleChanges) {
    this.themeClass = this.computeThemeClass();
  }

  private computeThemeClass(): string {
    if (this.variant === 'legal') return 'contact';
    const id = (this.currentSection || '').trim();
    if (!id || id === 'hero') return 'hero';
    return id;
  }

  navigateTo(id: string) {
    this.navigateSection.emit(id);
  }

  cycleLanguage() {
    this.justClicked = true;
    setTimeout(() => (this.justClicked = false), 150);
    const langs = ['en', 'de', 'ru'];
    let idx = langs.indexOf(this.currentLanguage);
    idx = (idx + 1) % langs.length;
    this.currentLanguage = langs[idx];
  }

  go(e: Event, id: string) {
    e.preventDefault();
    this.navigateTo(id);
  }

  navigateAndScroll(path: string[]): void {
    const target = path.join('/');
    const isHome = target === '/' || target === ''; // Prüfen ob Home

    this.router.navigate(path).then(success => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        const html = this.document.documentElement;
        const body = this.document.body;

        // 🧭 Scroll to Top
        requestAnimationFrame(() => {
          win.scrollTo({ top: 0, behavior: 'auto' });
          html.scrollTop = 0;
          body.scrollTop = 0;
        });

        // ✨ Falls Home: Hero Section aktivieren
        if (isHome) {
          // Trigger SectionNavService → hero scrollen
          const navService = (window as any).sectionNavService;
          if (navService?.requestScroll) {
            navService.requestScroll('hero');
          }
        }
      }

      this.sidenav?.close?.();
    });
  }

}
