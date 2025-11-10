import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService, SupportedLang } from '../language.service';
import { SECTIONS_TRANSLATIONS } from '../sections.config';

type Variant = 'home' | 'legal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None // 🔥 Wichtig, damit CSS-Themes greifen
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() variant: Variant = 'home';
  @Input() currentSection: string = 'hero';
  @Input() currentLanguage: SupportedLang = 'de';
  @Input() justClicked = false;
  @Output() navigateSection = new EventEmitter<string>();

  drawerOpen = false;
  sections = SECTIONS_TRANSLATIONS['de'];
  themeClass = 'hero';

  translations = {
    menu: { de: 'Menü', en: 'Menu', ru: 'Меню' },
    start: { de: 'Start', en: 'Home', ru: 'Главная' },
    impressum: { de: 'Impressum', en: 'Legal Notice', ru: 'Импрессум' },
    privacy: { de: 'Datenschutz', en: 'Privacy Policy', ru: 'Конфиденциальность' },
    name: { de: 'Stanislav Levin', en: 'Stanislav Levin', ru: 'Станислав Левин' },
  };

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private langService: LanguageService
  ) { }

  ngOnInit() {
    this.langService.lang$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.sections = SECTIONS_TRANSLATIONS[lang];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSection'] || changes['variant']) {
      this.updateThemeClass();
    }
  }


  private updateThemeClass(): void {
    // 🔸 Zuerst prüfen, ob es sich um die Legal-Variante handelt
    if (this.variant === 'legal') {
      this.themeClass = 'legal';
      return;
    }

    // 🔸 Ansonsten nach aktueller Section unterscheiden
    switch (this.currentSection) {
      case 'about':
        this.themeClass = 'about';
        break;
      case 'skills':
        this.themeClass = 'skills';
        break;
      case 'portfolio':
        this.themeClass = 'portfolio';
        break;
      case 'references':
        this.themeClass = 'references';
        break;
      case 'contact':
        this.themeClass = 'contact';
        break;
      default:
        this.themeClass = 'hero';
        break;
    }
  }


  toggleDrawer(force?: boolean) {
    this.drawerOpen = force ?? !this.drawerOpen;
  }

  navigateTo(id: string) {
    this.navigateSection.emit(id);
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
    const target = path.join('/');
    const isHome = target === '/' || target === '';
    this.router.navigate(path).then((success) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        requestAnimationFrame(() => win.scrollTo({ top: 0, behavior: 'auto' }));
      }
      this.toggleDrawer(false);
    });
  }

  get menuIcon(): string {
    switch (this.themeClass) {
      case 'about':
      case 'portfolio':
        return 'assets/icons/menuBlack.png'; // dunkles Icon
      case 'references':
      case 'hero':
      case 'skills':
      case 'contact':
      default:
        return 'assets/icons/menuWhite.png'; // Standard-weißes Icon
    }
  }

}
