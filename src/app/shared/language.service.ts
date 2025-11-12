/**
 * LanguageService
 * ----------------
 *
 * Verwaltet die aktive Sprache der Anwendung und synchronisiert sie
 * sowohl zwischen Komponenten (über RxJS) als auch mit dem Browser.
 *
 * Features:
 * - Reaktive Sprachverwaltung via `BehaviorSubject`
 * - Persistente Speicherung in `localStorage`
 * - Automatische Wiederherstellung beim App-Start
 * - Synchronisation des `<html lang="...">` Attributs
 *
 * Unterstützte Sprachen:
 * - de → Deutsch
 * - en → Englisch
 * - ru → Russisch
 */

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

/**
 * Typdefinition der unterstützten Sprachen im gesamten System.
 */
export type SupportedLang = 'de' | 'en' | 'ru';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  /**
   * Privates BehaviorSubject zur Speicherung der aktuellen Sprache.
   * 
   * Wird initial auf `'de'` gesetzt, falls keine gespeicherte Sprache vorhanden ist.
   */
  private _lang$ = new BehaviorSubject<SupportedLang>('de');

  /**
   * Öffentliches Observable zur reaktiven Beobachtung der aktuellen Sprache.
   * 
   * Komponenten können hierauf abonnieren, um Texte dynamisch zu aktualisieren.
   */
  lang$ = this._lang$.asObservable();

  /**
   * Konstruktor
   *
   * @param platformId - Angular Plattform-Token, um Browser- und Server-Umgebung zu unterscheiden.
   *
   * Wenn die App im Browser läuft:
   * - Wird die zuletzt gespeicherte Sprache aus dem LocalStorage wiederhergestellt.
   * - Das HTML-Lang-Attribut (`<html lang="...">`) wird automatisch gesetzt.
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.restore();
      this.lang$.subscribe((lang) => {
        document.documentElement.lang = lang;
      });
    }
  }

  /**
   * Getter für die aktuell aktive Sprache.
   *
   * @returns Aktuelle Sprache als `SupportedLang` (z. B. `'de'`, `'en'`, `'ru'`).
   */
  get current(): SupportedLang {
    return this._lang$.value;
  }

  /**
   * Setzt eine neue aktive Sprache.
   *
   * @param lang - Neue Sprache, die aktiviert werden soll.
   *
   * Ablauf:
   * - Aktualisiert das interne BehaviorSubject.
   * - Setzt das `<html lang="...">`-Attribut.
   * - Speichert die Einstellung im `localStorage` (nur im Browser).
   */
  setLang(lang: SupportedLang): void {
    this._lang$.next(lang);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      localStorage.setItem('app-lang', lang);
    }
  }

  /**
   * Stellt die zuletzt gespeicherte Sprache aus dem LocalStorage wieder her.
   *
   * Falls keine gültige Sprache gefunden wird, wird standardmäßig `'de'` gesetzt.
   */
  restore(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app-lang') as SupportedLang | null;
      if (saved && ['de', 'en', 'ru'].includes(saved)) {
        this._lang$.next(saved);
        document.documentElement.lang = saved;
      } else {
        this._lang$.next('de');
        document.documentElement.lang = 'de';
      }
    }
  }
}
