import {
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  PLATFORM_ID,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SectionNavService } from '../sections.config';
import { LanguageService, SupportedLang } from '../language.service';

type FooterVariant = 'home' | 'legal' | 'contact' | 'impressum' | 'privacy';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() variant: FooterVariant = 'home';
  @Output() navigateSection = new EventEmitter<string>();

  currentLang: SupportedLang = 'de';
  currentYear = new Date().getFullYear();

translations = {
  home: {
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
  linkedin: {
    de: 'LinkedIn',
    en: 'LinkedIn',
    ru: 'Линкедин',
  },
  github: {
    de: 'GitHub',
    en: 'GitHub',
    ru: 'ГитХаб',
  },
  copyright: {
    de: '© {{year}} Stanislav Levin',
    en: '© {{year}} Stanislav Levin',
    ru: '© {{year}} Станислав Левин',
  },
};


  constructor(
    private router: Router,
    private nav: SectionNavService,
    private langService: LanguageService,
    private cdr: ChangeDetectorRef, // ✅ nötig für Live-Update
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // Sprache abonnieren
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges(); // ✅ sofortige Template-Aktualisierung
    });
  }

  navigateAndScroll(path: string[]): void {
    const target = path.join('/');
    const isHome = target === '/' || target === '';

    this.router.navigate(path).then((success) => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView!;
        const html = this.document.documentElement;
        const body = this.document.body;

        // ⬆️ Seite ganz nach oben scrollen
        requestAnimationFrame(() => {
          win.scrollTo({ top: 0, behavior: 'auto' });
          html.scrollTop = 0;
          body.scrollTop = 0;
        });

        // 🏠 Wenn Home-Link → Hero-Section aktivieren
        if (isHome) {
          this.nav.requestScroll('hero');
          this.nav.setActive('hero');
        }
      }
    });
  }
}
