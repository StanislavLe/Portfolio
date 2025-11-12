import { Component, Input, OnInit, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService, SupportedLang } from '../language.service';
import { SECTIONS_TRANSLATIONS, SectionNavService } from '../sections.config';

type Variant = 'home' | 'legal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  /** 🔸 Variante: 'home' (default) oder 'legal' */
  @Input() variant: Variant = 'home';

  currentSection = 'hero';
  currentLanguage: SupportedLang = 'de';
  justClicked = false;
  drawerOpen = false;
  themeClass = 'hero';
  sections = SECTIONS_TRANSLATIONS['de'];

  translations = {
    menu: { de: 'Menü', en: 'Menu', ru: 'Меню' },
    start: { de: 'Start', en: 'Home', ru: 'Главная' },
    impressum: { de: 'Impressum', en: 'Legal Notice', ru: 'Импрессум' },
    privacy: { de: 'Datenschutz', en: 'Privacy Policy', ru: 'Конфиденциальность' },
    name: { de: 'Stanislav Levin', en: 'Stanislav Levin', ru: 'Станислав Левин' },
  };

  constructor(
    private router: Router,
    private nav: SectionNavService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private langService: LanguageService
  ) {}

  ngOnInit() {
    this.langService.lang$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.sections = SECTIONS_TRANSLATIONS[lang];
    });

    // 🔹 Nur bei "home" Variante auf SectionNav reagieren
    if (this.variant === 'home') {
      this.nav.active$.subscribe((id) => {
        this.currentSection = id;
        this.themeClass = id;
      });
    }

    // 🔹 Bei "legal" immer festes Theme
    if (this.variant === 'legal') {
      this.themeClass = 'legal';
    }
  }

  toggleDrawer(force?: boolean) {
    this.drawerOpen = force ?? !this.drawerOpen;
  }

  navigateTo(id: string) {
    if (this.variant === 'home') {
      this.nav.requestScroll(id);
    } else {
      this.navigateAndScroll(['/']);
    }
    this.toggleDrawer(false);
  }

  cycleLanguage() {
    this.justClicked = true;
    setTimeout(() => (this.justClicked = false), 150);

    const langs: SupportedLang[] = ['de', 'en', 'ru'];
    const next = langs[(langs.indexOf(this.currentLanguage) + 1) % langs.length];
    this.langService.setLang(next);
  }

  navigateAndScroll(path: string[]): void {
    this.router.navigate(path).then((success) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        requestAnimationFrame(() => win.scrollTo({ top: 0, behavior: 'auto' }));
      }
      this.toggleDrawer(false);
    });
  }

  get menuIcon(): string {
    // 🔹 Legal-Variante immer dunkles Icon
    if (this.variant === 'legal') {
      return 'assets/icons/menuWhite.png';
    }

    switch (this.themeClass) {
      case 'about':
      case 'portfolio':
        return 'assets/icons/menuBlack.png';
      case 'references':
      case 'hero':
      case 'skills':
      case 'contact':
      default:
        return 'assets/icons/menuWhite.png';
    }
  }
}
