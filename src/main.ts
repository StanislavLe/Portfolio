/**
 * main.ts
 * --------
 * 
 * Einstiegspunkt der Angular-Anwendung.
 * 
 * Verantwortlichkeiten:
 * ---------------------
 * - Bootstrapping der Hauptkomponente (`AppComponent`)
 * - Konfiguration des Angular Routers
 * - Initialisierung globaler Features (z. B. Animationen, HTTP)
 * - Safari-kompatible Viewport-Korrektur für mobile Geräte
 * 
 * Besondere Hinweise:
 * -------------------
 * Safari (iOS) verändert bei Scroll- und Tastaturereignissen die Fensterhöhe (`innerHeight`),
 * was zu Layout-Sprüngen führen kann — insbesondere bei `100vh`/`100dvh` Layouts.
 * 
 * Um das zu verhindern, wird hier eine CSS-Variable `--vh` definiert, 
 * die stabilisiert und anstelle von `vh` in CSS verwendet werden sollte:
 * 
 * ```scss
 * height: calc(var(--vh, 1vh) * 100);
 * ```
 * 
 * Dadurch bleibt die Layout-Höhe konstant, auch wenn Safari die UI-Leisten ein- oder ausblendet.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, ExtraOptions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

// ------------------------------------------------------------
// 🧩 Viewport-Fix (Safari/iOS)
// ------------------------------------------------------------

/**
 * Initialisiert eine stabile CSS-Variable `--vh` für die Viewport-Höhe.
 * 
 * Problemhintergrund:
 * -------------------
 * Auf mobilen Geräten (insbesondere Safari) verändert sich `window.innerHeight`, 
 * wenn die Adressleiste oder Tastatur eingeblendet wird. Das führt bei 100vh-Layouts
 * zu sichtbaren Sprüngen. 
 * 
 * Lösung:
 * -------
 * Berechne 1 % der aktuellen Fensterhöhe (`innerHeight * 0.01`)
 * und speichere den Wert als CSS-Variable `--vh`.
 * 
 * Diese Variable wird dann in den Styles verwendet, z. B.:
 * ```scss
 * height: calc(var(--vh, 1vh) * 100);
 * ```
 */
function setViewportHeight(): void {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Beim Start initialisieren
setViewportHeight();

// Nur bei stabilen Resize-Events oder Orientation-Änderungen neu berechnen
let resizeTimeout: ReturnType<typeof setTimeout> | undefined;

/**
 * Verzögert das Aktualisieren der Viewport-Höhe, 
 * um Layout-Sprünge bei Safari-Toolbar-Animationen zu vermeiden.
 */
const debouncedSetViewportHeight = (): void => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(setViewportHeight, 250);
};

// Event Listener für echte Änderungen (nicht bei Scroll)
window.addEventListener('resize', debouncedSetViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// ------------------------------------------------------------
// 🚦 Router-Konfiguration
// ------------------------------------------------------------

/**
 * Definiert das Verhalten des Angular Routers:
 * 
 * - `scrollPositionRestoration: 'enabled'`:
 *   Stellt beim Zurücknavigieren die vorherige Scroll-Position wieder her.
 * 
 * - `anchorScrolling: 'enabled'`:
 *   Aktiviert das automatische Scrollen zu Anker-Links (`#elementId`).
 * 
 * - `scrollOffset: [0, 0]`:
 *   Kein zusätzlicher Offset (nützlich, wenn z. B. ein Header fixiert ist).
 */
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
};

// ------------------------------------------------------------
// 🚀 Bootstrap der Angular-Anwendung
// ------------------------------------------------------------

/**
 * Startet die Angular-Anwendung mit allen notwendigen Providern.
 * 
 * Enthaltene Provider:
 * - `RouterModule` + `provideRouter(routes)`: Aktiviert Routing-System.
 * - `provideAnimations()`: Aktiviert Browser-Animationen (Angular Animations API).
 * - `provideHttpClient()`: Stellt globale HTTP-Kommunikation bereit.
 */
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes, routerOptions)),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
  ],
});
