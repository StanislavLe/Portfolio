/**
 * SectionNavService + Config
 * --------------------------
 *
 * Enthält:
 * - Zentrale Feature-Steuerung
 * - Mehrsprachige Section-Konfiguration (dynamisch)
 * - SectionNavService zur Synchronisation zwischen Komponenten
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SupportedLang } from './language.service';

/* -------------------------------------------
 * 🧩 Feature-Steuerung (zentral hier verwaltet)
 * ------------------------------------------- */
export const FEATURE_FLAGS = {
  references: false, // später auf true setzen, um die Referenzen-Section zu aktivieren
};

/* -------------------------------------------
 * 🔤 Mehrsprachige Section-Konfiguration
 * ------------------------------------------- */
export const SECTIONS_TRANSLATIONS: Record<
  SupportedLang,
  { id: string; label: string }[]
> = {
  de: [
    { id: 'hero', label: 'Start' },
    { id: 'about', label: 'Über mich' },
    { id: 'skills', label: 'Fähigkeiten' },
    { id: 'portfolio', label: 'Portfolio' },
    ...(FEATURE_FLAGS.references
      ? [{ id: 'references', label: 'Referenzen' }]
      : []),
    { id: 'contact', label: 'Kontakt' },
  ],
  en: [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'skills', label: 'Skillset' },
    { id: 'portfolio', label: 'Portfolio' },
    ...(FEATURE_FLAGS.references
      ? [{ id: 'references', label: 'References' }]
      : []),
    { id: 'contact', label: 'Contact' },
  ],
  ru: [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'Обо мне' },
    { id: 'skills', label: 'Навыки' },
    { id: 'portfolio', label: 'Портфолио' },
    ...(FEATURE_FLAGS.references
      ? [{ id: 'references', label: 'Рекомендации' }]
      : []),
    { id: 'contact', label: 'Контакт' },
  ],
};

/* -------------------------------------------
 * 🇩🇪 Standard-Export (deutsche Default-Sprache)
 * ------------------------------------------- */
export const SECTIONS = SECTIONS_TRANSLATIONS['de'];

/* -------------------------------------------
 * 🚀 SectionNavService
 * ------------------------------------------- */
@Injectable({ providedIn: 'root' })
export class SectionNavService {
  /** Subject zum Senden von Scroll-Anfragen. */
  private _scrollTo$ = new Subject<string>();
  scrollTo$ = this._scrollTo$.asObservable();

  /** Sendet eine Scroll-Anfrage und prüft, ob das Ziel die letzte Section ist. */
  requestScroll(id: string): void {
    this._scrollTo$.next(id);
    this.updateIsLast(id);
  }

  /** Aktive Section-ID (z. B. "hero") */
  private _active$ = new BehaviorSubject<string>('hero');
  active$ = this._active$.asObservable();

  /** Setzt die aktive Section. */
  setActive(id: string): void {
    this._active$.next(id);
    this.updateIsLast(id);
  }

  /** Ob sich der Nutzer in der letzten Section befindet. */
  private _isLast$ = new BehaviorSubject<boolean>(false);
  isLast$ = this._isLast$.asObservable();

  /** Prüft, ob aktuelle Section = letzte Section */
  private updateIsLast(id: string): void {
    const lastId = SECTIONS[SECTIONS.length - 1].id;
    this._isLast$.next(id === lastId);
  }
}
