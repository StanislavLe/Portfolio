/**
 * SectionNavService
 * ------------------
 *
 * Zentraler Service zur Verwaltung und Synchronisierung der aktiven Seiten-Sektionen.
 * 
 * Aufgaben:
 * - Verwaltung der aktuell aktiven Section (`active$`)
 * - Steuerung gezielter Scroll-Befehle zwischen Komponenten (`scrollTo$`)
 * - Erkennung, ob die letzte Section aktiv ist (`isLast$`)
 * 
 * Wird von folgenden Komponenten genutzt:
 * - `HeaderComponent`
 * - `FooterComponent`
 * - `HomeComponent`
 * - `SectionPagerComponent`
 *
 * Reaktive Architektur:
 * - RxJS `BehaviorSubject` → speichert aktuellen Zustand (`active$`, `isLast$`)
 * - RxJS `Subject` → sendet gezielte Aktionen (Scroll Requests)
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SupportedLang } from './language.service';

@Injectable({ providedIn: 'root' })
export class SectionNavService {
  /**
   * Subject zum Senden von Scroll-Anfragen.
   * 
   * Wird verwendet, um eine bestimmte Section anzusteuern,
   * z. B. durch Klick im Header, Footer oder externe Navigation.
   */
  private _scrollTo$ = new Subject<string>();

  /**
   * Öffentliches Observable, auf das Komponenten wie der `SectionPager`
   * abonnieren, um Scroll-Anweisungen zu erhalten.
   */
  scrollTo$ = this._scrollTo$.asObservable();

  /**
   * Sendet eine neue Scroll-Anfrage und aktualisiert ggf. den "Letzte Section"-Status.
   *
   * @param id - ID der Section, zu der gescrollt werden soll (z. B. `"contact"`).
   */
  requestScroll(id: string): void {
    this._scrollTo$.next(id);
    this.updateIsLast(id);
  }

  /**
   * BehaviorSubject zur Speicherung der aktuell aktiven Section-ID.
   * 
   * Standardwert: `'hero'`
   */
  private _active$ = new BehaviorSubject<string>('hero');

  /**
   * Öffentliches Observable, das den aktuellen Abschnitt liefert.
   * 
   * Komponenten können hierauf reagieren, um UI oder Theme zu aktualisieren.
   */
  active$ = this._active$.asObservable();

  /**
   * Setzt eine neue aktive Section und prüft, ob diese die letzte ist.
   *
   * @param id - ID der aktivierten Section (z. B. `"about"`, `"skills"`).
   */
  setActive(id: string): void {
    this._active$.next(id);
    this.updateIsLast(id);
  }

  /**
   * BehaviorSubject, das anzeigt, ob sich der Nutzer aktuell in der letzten Section befindet.
   */
  private _isLast$ = new BehaviorSubject<boolean>(false);

  /**
   * Öffentliches Observable für den "letzte Section"-Status.
   * 
   * Wird z. B. verwendet, um bestimmte UI-Elemente oder Navigationseffekte zu steuern.
   */
  isLast$ = this._isLast$.asObservable();

  /**
   * Aktualisiert den Status, ob die aktuelle Section die letzte in der Reihenfolge ist.
   * 
   * @param id - ID der zu prüfenden Section.
   */
  private updateIsLast(id: string): void {
    const lastId = SECTIONS[SECTIONS.length - 1].id;
    this._isLast$.next(id === lastId);
  }
}

/**
 * SECTIONS_TRANSLATIONS
 * ----------------------
 *
 * Enthält die sprachabhängigen Labels und IDs aller sichtbaren Sections.
 * 
 * Diese Struktur ermöglicht, dass die Navigations-UI (z. B. Header- oder Footer-Menü)
 * die passenden Texte in der aktuell ausgewählten Sprache anzeigt.
 */
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

/**
 * SECTIONS
 * ---------
 *
 * Standard-Export der deutschen Sektionen (Defaultsprache).
 * Wird u. a. vom `SectionPagerComponent` als Standardkonfiguration genutzt.
 */
export const SECTIONS = SECTIONS_TRANSLATIONS['de'];
