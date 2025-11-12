/**
 * AboutMeComponent
 * -----------------
 *
 * Diese Komponente bildet den „Über mich“-Abschnitt der Website.
 *
 * Hauptaufgaben:
 * - Darstellung persönlicher Informationen in mehreren Sprachen
 * - Anzeige charakteristischer Eigenschaften mit Icons
 * - Dynamischer Sprachwechsel via `LanguageService`
 * - Interaktives Info-Panel ("Mehr über mich") mit Ein-/Ausblenden
 * - Call-to-Action-Button zum Scrollen zur Kontaktsektion
 *
 * Besonderheiten:
 * - Nutzung von `inject()` für den `SectionNavService` (modernes Angular-Pattern)
 * - Getrennte Stylesheets für Basis- und Responsive-Design
 * - Reaktive Change Detection bei Sprachwechsel
 */

import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService, SupportedLang } from '../shared/language.service';
import { SectionNavService } from '../shared/sections.config';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss', './about-me.component.media.scss']
})
export class AboutMeComponent implements OnInit {
  /**
   * Aktuell ausgewählte Sprache der Anwendung.
   * Wird reaktiv über den `LanguageService` verwaltet.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Instanz des globalen Navigationsservices.
   * Wird per `inject()` eingebunden (anstatt über den Konstruktor).
   */
  private sectionNav = inject(SectionNavService);

  /**
   * Mehrsprachige Textinhalte der Komponente.
   * Alle sichtbaren Texte, Labels und Eigenschaften sind sprachabhängig.
   */
  translations = {
    title: {
      de: 'Über mich',
      en: 'About Me',
      ru: 'Обо мне',
    },
    intro: {
      de: `Hallo, ich bin Stanislav.<br>
           Mit Wurzeln in der Industrie habe ich den Weg ins Programmieren gefunden.
           Heute nutze ich genau diese Schnittstelle, um neue Ideen in smarte Lösungen zu verwandeln.`,
      en: `Hi, I’m Stanislav.<br>
           Coming from an industrial background, I found my way into programming.
           Today, I use this intersection to turn ideas into smart digital solutions.`,
      ru: `Привет, я Станислав.<br>
           Проработав в промышленности, я нашёл себя в программировании.
           Сегодня я использую этот опыт, чтобы превращать идеи в умные решения.`,
    },
    button: {
      de: 'Schreib mir',
      en: 'Write to me',
      ru: 'Напиши мне',
    },
    secretTitle: {
      de: 'Mehr über mich',
      en: 'More about me',
      ru: 'Больше обо мне',
    },
    traits: {
      de: [
        { icon: 'check_circle', text: 'Analytisch' },
        { icon: 'check_circle', text: 'Kreativ' },
        { icon: 'check_circle', text: 'Teamplayer' },
        { icon: 'check_circle', text: 'Detailverliebt' },
        { icon: 'check_circle', text: 'Motiviert' },
        { icon: 'check_circle', text: 'Neugierig' },
      ],
      en: [
        { icon: 'check_circle', text: 'Analytical' },
        { icon: 'check_circle', text: 'Creative' },
        { icon: 'check_circle', text: 'Team player' },
        { icon: 'check_circle', text: 'Detail-oriented' },
        { icon: 'check_circle', text: 'Motivated' },
        { icon: 'check_circle', text: 'Curious' },
      ],
      ru: [
        { icon: 'check_circle', text: 'Аналитичный' },
        { icon: 'check_circle', text: 'Креативный' },
        { icon: 'check_circle', text: 'Командный тип' },
        { icon: 'check_circle', text: 'Аккуратный' },
        { icon: 'check_circle', text: 'Мотивированный' },
        { icon: 'check_circle', text: 'Любознательный' },
      ],
    }
  };

  /**
   * Steuert die Sichtbarkeit des Zusatz-Info-Panels („Mehr über mich“).
   */
  panelVisible = false;

  /**
   * Konstruktor
   *
   * @param langService - Service zur Steuerung der aktiven Sprache
   * @param cdr - ChangeDetectorRef für manuelle UI-Aktualisierung
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Abonniert Sprachänderungen und aktualisiert dynamisch die View,
   * wenn der Benutzer die Sprache umschaltet.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  /**
   * Öffnet oder schließt das „Mehr über mich“-Panel.
   */
  togglePanel(): void {
    this.panelVisible = !this.panelVisible;
  }

  /**
   * Schließt das Info-Panel, falls es sichtbar ist.
   */
  closePanel(): void {
    this.panelVisible = false;
  }

  /**
   * Scrollt sanft zur Kontaktsektion am Ende der Seite.
   * Wird durch den Button „Schreib mir“ ausgelöst.
   */
  scrollToContact(): void {
    this.sectionNav.requestScroll('contact');
  }
}
