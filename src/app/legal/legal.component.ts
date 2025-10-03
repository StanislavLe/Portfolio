import { Component, Inject, NgZone, OnDestroy, OnInit, Renderer2, PLATFORM_ID } from '@angular/core';
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
export class LegalComponent implements OnInit, OnDestroy {
  showOutlet = true;

  private removePageshowListener?: () => void;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Nur bfcache-Fall (iOS/Safari) behandeln
    const win = this.document.defaultView;
    if (win) {
      this.removePageshowListener = this.renderer.listen(
        win,
        'pageshow',
        (e: PageTransitionEvent) => {
          if ((e as any).persisted) {
            // Seite kam aus dem bfcache -> Outlet einmal hart neu montieren
            this.ngZone.run(() => {
              this.showOutlet = false;
              queueMicrotask(() => { this.showOutlet = true; });
            });
          }
        }
      );
    }
  }

  // Optional: Debug-Hooks für dein Template
  onActivate(_c: unknown) { /* console.log('activate', _c); */ }
  onDeactivate(_c: unknown) { /* console.log('deactivate', _c); */ }

  ngOnDestroy(): void {
    if (this.removePageshowListener) {
      this.removePageshowListener();
      this.removePageshowListener = undefined;
    }
  }
}
