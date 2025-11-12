/**
 * LegalComponent
 * ---------------
 * 
 * Diese Komponente repräsentiert die rechtlichen Seiten der Anwendung
 * (z. B. Impressum, Datenschutz, Nutzungsbedingungen).
 * 
 * Sie sorgt dafür, dass beim Aufruf dieser Seiten immer nach oben gescrollt wird,
 * unabhängig davon, aus welcher Position der Benutzer kam.
 * 
 * Außerdem werden Header und Footer eingebunden,
 * während der Hauptinhalt dynamisch über den RouterOutlet geladen wird.
 */

import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
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

  /**
   * Konstruktor
   * 
   * Injiziert die benötigten Abhängigkeiten:
   * 
   * @param platformId - Identifiziert, ob die App im Browser oder auf dem Server läuft.
   *                     Wird verwendet, um DOM-Operationen nur im Browser auszuführen.
   * @param document - Zugriff auf das globale Dokumentobjekt, um Scrollaktionen durchzuführen.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   * 
   * Wird beim Initialisieren der Komponente aufgerufen.
   * 
   * - Führt einen Scroll nach oben aus, sobald die Seite geladen ist.
   * - Führt den Scrollvorgang erst nach der nächsten Browser-Render-Phase aus,
   *   um Layout-Verschiebungen oder Race-Conditions zu vermeiden.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const win = this.document.defaultView;
          win?.scrollTo({ top: 0, behavior: 'auto' });
        }, 50);
      });
    }
  }

  /**
   * Scrollt den gesamten Seiteninhalt sofort nach oben.
   * 
   * Wird als Hilfsmethode verwendet, falls manuell
   * oder von anderen Events ein „Back to Top“ ausgelöst werden soll.
   */
  private scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const body = this.document.body;
    body.scrollTo({ top: 0, behavior: 'auto' });
  }
}
