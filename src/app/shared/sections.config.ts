import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SupportedLang } from './language.service';

@Injectable({ providedIn: 'root' })
export class SectionNavService {
  private _scrollTo$ = new Subject<string>();
  scrollTo$ = this._scrollTo$.asObservable();

  requestScroll(id: string) {
    this._scrollTo$.next(id);
    this.updateIsLast(id);
  }

  private _active$ = new BehaviorSubject<string>('hero');
  active$ = this._active$.asObservable();

  setActive(id: string) {
    this._active$.next(id);
    this.updateIsLast(id);
  }

  private _isLast$ = new BehaviorSubject<boolean>(false);
  isLast$ = this._isLast$.asObservable();

  private updateIsLast(id: string) {
    const lastId = SECTIONS[SECTIONS.length - 1].id;
    this._isLast$.next(id === lastId);
  }
}

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
    { id: 'skills', label: 'Skillset' },
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

export const SECTIONS = SECTIONS_TRANSLATIONS['de'];
