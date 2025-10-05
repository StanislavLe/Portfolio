// src/app/shared/language.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLang = 'de' | 'en' | 'ru';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang$ = new BehaviorSubject<SupportedLang>('de');
  lang$ = this._lang$.asObservable();

  get current() {
    return this._lang$.value;
  }

  setLang(lang: SupportedLang) {
    this._lang$.next(lang);
    // Optional: Im LocalStorage speichern
    localStorage.setItem('app-lang', lang);
  }

  restore() {
    const saved = localStorage.getItem('app-lang') as SupportedLang | null;
    if (saved) this._lang$.next(saved);
  }
}
