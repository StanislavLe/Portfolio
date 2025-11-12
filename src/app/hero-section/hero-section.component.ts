/**
 * HeroSectionComponent
 * ---------------------
 *
 * Die Startsektion (Hero-Block) der Webseite.
 * 
 * Aufgaben:
 * - Begrüßung und Vorstellung (mehrsprachig)
 * - Anzeige des Namens und der Rolle
 * - Call-to-Action-Button, der zum Kontaktabschnitt scrollt
 *
 * Features:
 * - Dynamische Sprachumschaltung über `LanguageService`
 * - Reaktives Change-Detection-Update
 * - Integration mit der globalen Scroll-Navigation (`SectionNavService`)
 * - Getrennte Stylesheets für Basis- und Responsive-Design (`.scss` / `.media.scss`)
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService, SupportedLang } from '../shared/language.service';
import { SectionNavService } from '../shared/sections.config';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: [
    './hero-section.component.scss',
    './hero-section.component.media.scss',
  ],
})
export class HeroSectionComponent implements OnInit {
  /**
   * Aktuell aktive Sprache der Anwendung.
   * Wird durch den `LanguageService` verwaltet und aktualisiert.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Sprachabhängige Übersetzungen für die Texte innerhalb der Hero-Sektion.
   */
  translations = {
    greeting: {
      de: 'Hallo zusammen! Ich bin',
      en: 'Hello everyone! I am',
      ru: 'Всем привет! Я',
    },
    name: {
      de: 'Stanislav Levin',
      en: 'Stanislav Levin',
      ru: 'Станислав Левин',
    },
    role: {
      de: 'Frontend Entwickler',
      en: 'Frontend Developer',
      ru: 'Фронтенд-разработчик',
    },
    button: {
      de: 'Kontaktiere mich',
      en: 'Get in Touch',
      ru: 'Связаться со мной',
    },
  };

  /**
   * Konstruktor
   *
   * @param langService - Service zur Steuerung der aktiven Sprache
   * @param cdr - ChangeDetectorRef für manuelle Aktualisierung der View (nach Sprachwechsel)
   * @param nav - Globaler Navigationsservice zum Scrollen zwischen Sektionen
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private nav: SectionNavService
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Abonniert die Sprachänderungen des `LanguageService`.
   * Wenn die Sprache geändert wird, aktualisiert die Komponente ihre Texte
   * und triggert eine Change Detection, um das UI sofort zu aktualisieren.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  /**
   * Scrollt sanft zur Kontaktsektion am Seitenende.
   *
   * Wird durch den Call-to-Action-Button ausgelöst:
   * `"Kontaktiere mich" / "Get in Touch" / "Связаться со мной"`
   */
  scrollToContactSection(): void {
    this.nav.requestScroll('contact');
  }
}
