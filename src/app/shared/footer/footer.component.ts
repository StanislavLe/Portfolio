import {
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SectionNavService } from '../sections.config'; // ✅ direkt einbinden

type FooterVariant = 'home' | 'legal' | 'contact' | 'impressum' | 'privacy';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() variant: FooterVariant = 'home';
  @Output() navigateSection = new EventEmitter<string>();

  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private nav: SectionNavService,  // ✅ direkt Service injizieren
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

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

        // ✨ Falls Home → Hero aktivieren
        if (isHome) {
          this.nav.requestScroll('hero');  // ✅ direkt Service-Aufruf
          this.nav.setActive('hero');
        }
      }
    });
  }
}
