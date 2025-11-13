/**
 * LegalComponent
 * ---------------
 * 
 * Diese Komponente stellt sicher, dass beim Öffnen der /legal-Seite
 * immer automatisch zum Seitenanfang gescrollt wird –
 * unabhängig davon, aus welcher Section der Benutzer kam.
 * 
 * Der Scrollvorgang wird bewusst erst nach dem vollständigen Rendering
 * aller Child-Komponenten (Header, Footer, RouterOutlet) ausgeführt,
 * um Layout-Verschiebungen zu vermeiden.
 */

import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit
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
export class LegalComponent implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Lifecycle Hook – `ngAfterViewInit`
   * -----------------------------------
   * Wird aufgerufen, wenn alle Child-Komponenten (Header, Footer, etc.)
   * vollständig im DOM aufgebaut sind.
   * 
   * Scrollt dann zuverlässig zum Seitenanfang.
   */
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        const win = this.document.defaultView;
        if (win) {
          win.scrollTo({ top: 0, behavior: 'auto' });
        }
      }, 100);
    });
  }
}
