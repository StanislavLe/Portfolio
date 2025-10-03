import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SectionNavService {
  // Header/Footer -> Pager: scroll request
  private _scrollTo$ = new Subject<string>();
  scrollTo$ = this._scrollTo$.asObservable();
  requestScroll(id: string) { this._scrollTo$.next(id); }

  // Pager -> Header/Footer: active section id
  private _active$ = new BehaviorSubject<string>('hero');
  active$ = this._active$.asObservable();
  setActive(id: string) { this._active$.next(id); }

  // Pager -> Home: bin ich auf der letzten Section?
  private _isLast$ = new BehaviorSubject<boolean>(false);
  isLast$ = this._isLast$.asObservable();
  setIsLast(v: boolean) { this._isLast$.next(v); }
}

export const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'references', label: 'References' },
  { id: 'contact', label: 'Contact' }
];

// Extra Konfiguration für Footer / Styles
export const FOOTER_VARIANTS: Record<string, 'contact' | 'impressum' | 'privacy' | 'default'> = {
  contact: 'contact',
  impressum: 'impressum',
  privacy: 'privacy'
};
