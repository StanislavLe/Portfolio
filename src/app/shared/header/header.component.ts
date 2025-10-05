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
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SECTIONS } from '../sections.config';
import { LanguageService, SupportedLang } from '../language.service';

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
export class HeaderComponent implements OnInit, OnChanges {
  @Input() variant: Variant = 'home';
  @Input() currentSection: string = 'hero';
  @Input() currentLanguage: SupportedLang = 'de';
  @Input() justClicked = false;
  @Output() navigateSection = new EventEmitter<string>();
  @ViewChild('sidenav') sidenav!: MatSidenav;

  sections = SECTIONS;


  translations = {
  menu: {
    de: 'Menü',
    en: 'Menu',
    ru: 'Меню',
  },
  start: {
    de: 'Start',
    en: 'Home',
    ru: 'Главная',
  },
  impressum: {
    de: 'Impressum',
    en: 'Legal Notice',
    ru: 'Импрессум',
  },
  privacy: {
    de: 'Datenschutz',
    en: 'Privacy Policy',
    ru: 'Конфиденциальность',
  },
  name: {
    de: 'Stanislav Levin',
    en: 'Stanislav Levin',
    ru: 'Станислав Левин',
  },
};



  themeClass = 'hero';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private langService: LanguageService // ✅ Sprachservice injiziert
  ) {}

  // === INIT ===
  ngOnInit() {
    // Sprache abonnieren → Button-Label & <html lang=""> aktuell halten
    this.langService.lang$.subscribe((lang) => {
      this.currentLanguage = lang;
      if (isPlatformBrowser(this.platformId)) {
        this.document.documentElement.lang = lang;
      }
    });
  }

  // === SECTION / VARIANTE ===
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

  // === SPRACHWECHSEL ===
  cycleLanguage() {
    this.justClicked = true;
    setTimeout(() => (this.justClicked = false), 150);

    const langs: SupportedLang[] = ['de', 'en', 'ru'];
    const next = langs[(langs.indexOf(this.currentLanguage) + 1) % langs.length];
    this.langService.setLang(next);
  }

  // === SCROLL / NAVIGATION ===
  go(e: Event, id: string) {
    e.preventDefault();
    this.navigateTo(id);
  }

  navigateAndScroll(path: string[]): void {
    const target = path.join('/');
    const isHome = target === '/' || target === '';

    this.router.navigate(path).then((success) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        const html = this.document.documentElement;
        const body = this.document.body;

        // 🧭 Scroll to Top (sicher auf Safari)
        requestAnimationFrame(() => {
          win.scrollTo({ top: 0, behavior: 'auto' });
          html.scrollTop = 0;
          body.scrollTop = 0;
        });

        // ✨ Wenn Home: Hero-Section aktivieren
        if (isHome) {
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
