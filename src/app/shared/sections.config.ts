import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SupportedLang } from './language.service'; // 👈 Importiere deinen Sprachtyp

@Injectable({ providedIn: 'root' })
export class SectionNavService {
  private _scrollTo$ = new Subject<string>();
  scrollTo$ = this._scrollTo$.asObservable();
  requestScroll(id: string) {
    this._scrollTo$.next(id);
  }

  private _active$ = new BehaviorSubject<string>('hero');
  active$ = this._active$.asObservable();
  setActive(id: string) {
    this._active$.next(id);
  }

  private _isLast$ = new BehaviorSubject<boolean>(false);
  isLast$ = this._isLast$.asObservable();
  setIsLast(v: boolean) {
    this._isLast$.next(v);
  }
}

/* 🌍 Mehrsprachige Sections */
export const SECTIONS_TRANSLATIONS: Record<SupportedLang, { id: string; label: string }[]> = {
  de: [
    { id: 'hero', label: 'Start' },
    { id: 'about', label: 'Über mich' },
    { id: 'skills', label: 'Fähigkeiten' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'references', label: 'Referenzen' },
    { id: 'contact', label: 'Kontakt' },
  ],
  en: [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'references', label: 'References' },
    { id: 'contact', label: 'Contact' },
  ],
  ru: [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'Обо мне' },
    { id: 'skills', label: 'Навыки' },
    { id: 'portfolio', label: 'Портфолио' },
    { id: 'references', label: 'Рекомендации' },
    { id: 'contact', label: 'Контакт' },
  ],
};

/* 🧱 Fallback auf Deutsch */
export const SECTIONS = SECTIONS_TRANSLATIONS['de'];

export const FOOTER_VARIANTS: Record<string, 'contact' | 'impressum' | 'privacy' | 'default'> = {
  contact: 'contact',
  impressum: 'impressum',
  privacy: 'privacy',
};
