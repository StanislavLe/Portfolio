import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type SupportedLang = 'de' | 'en' | 'ru';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang$ = new BehaviorSubject<SupportedLang>('de');
  lang$ = this._lang$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Restore nur im Browser
    if (isPlatformBrowser(this.platformId)) {
      this.restore();

      // <html lang="..."> synchronisieren
      this.lang$.subscribe((lang) => {
        document.documentElement.lang = lang;
      });
    }
  }

  get current(): SupportedLang {
    return this._lang$.value;
  }

  setLang(lang: SupportedLang): void {
    this._lang$.next(lang);

    if (isPlatformBrowser(this.platformId)) {
      // <html lang="..."> aktualisieren
      document.documentElement.lang = lang;

      // im LocalStorage speichern
      localStorage.setItem('app-lang', lang);
    }
  }

  restore(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app-lang') as SupportedLang | null;

      if (saved && ['de', 'en', 'ru'].includes(saved)) {
        this._lang$.next(saved);
        document.documentElement.lang = saved;
      } else {
        // Fallback auf Deutsch
        this._lang$.next('de');
        document.documentElement.lang = 'de';
      }
    }
  }
}
