import {
  Component, Inject, OnInit, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './legal.component.html',
})
export class LegalComponent implements OnInit {
  showOutlet = true; // 👈 wieder da

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const win = this.document.defaultView;
    if (win && 'scrollRestoration' in win.history) {
      try { win.history.scrollRestoration = 'manual'; } catch {}
    }

    // optional: iOS bfcache remount
    if (win) {
      win.addEventListener('pageshow', (e: PageTransitionEvent) => {
        if ((e as any).persisted) {
          this.showOutlet = false;
          queueMicrotask(() => {
            this.showOutlet = true;
            this.scrollToTop();
          });
        }
      });
    }
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const win = this.document.defaultView;
    if (!win) return;

    const main = this.document.querySelector('main.legal') as HTMLElement | null;
    if (main) main.style.overflowAnchor = 'none';

    const root = (this.document.scrollingElement || this.document.documentElement) as HTMLElement;
    const oldBehavior = (root.style as any).scrollBehavior;
    (root.style as any).scrollBehavior = 'auto';

    const doScroll = () => {
      win.scrollTo(0, 0);
      root.scrollTop = 0;
      if (main) main.scrollTop = 0;
    };

    doScroll();
    win.requestAnimationFrame(() => {
      doScroll();
      setTimeout(() => {
        doScroll();
        setTimeout(() => doScroll(), 60);
        (root.style as any).scrollBehavior = oldBehavior ?? '';
      }, 0);
    });
  }
}
