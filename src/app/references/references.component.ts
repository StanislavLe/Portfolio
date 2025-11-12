/**
 * ReferencesComponent
 * --------------------
 *
 * Diese Komponente zeigt Feedback und Referenzen von Kollegen in mehreren Sprachen an.
 * Sie dient der Darstellung sozialer Beweise („Social Proof“) und stärkt die Glaubwürdigkeit des Entwicklers.
 *
 * Hauptaufgaben:
 * - Anzeige mehrerer Kollegenkommentare mit Name, Titel und Feedback
 * - Dynamische Sprachumschaltung über `LanguageService`
 * - Reaktives UI-Update mittels `ChangeDetectorRef` und `NgZone`
 * - Nutzung der Kind-Komponente `ColleagueCommentComponent` zur Darstellung einzelner Testimonials
 *
 * Besonderheiten:
 * - Alle Texte und Kommentare sind mehrsprachig (Deutsch, Englisch, Russisch)
 * - `runOutsideAngular` optimiert Performance durch gezieltes manuelles Triggern der Change Detection
 */

import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { ColleagueCommentComponent } from './colleague-comment/colleague-comment.component';
import { LanguageService, SupportedLang } from './../shared/language.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [ColleagueCommentComponent, NgFor],
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
})
export class ReferencesComponent {
  /**
   * Aktuell aktive Sprache, wird reaktiv vom `LanguageService` aktualisiert.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Mehrsprachiger Titel für die Referenzen-Sektion.
   */
  translations = {
    title: {
      de: 'Feedback meiner Kollegen',
      en: 'Feedback from my colleagues',
      ru: 'Отзывы моих коллег',
    },
  };

  /**
   * Sammlung aller Referenzen sortiert nach Sprache.
   * Jeder Eintrag enthält:
   * - `name`: Name der Person
   * - `comment`: Feedbacktext
   * - `profileLink`: Verlinkung auf ein soziales Profil (z. B. LinkedIn)
   * - `title`: Berufsbezeichnung oder Position
   */
  comments: Record<SupportedLang, any[]> = {
    de: [
      {
        name: 'John Doe',
        comment:
          'Stani ist ein engagierter und talentierter Entwickler. Seine Arbeit an JOIN war beeindruckend, besonders die Drag-and-Drop-Funktionalität.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Senior Entwickler bei Beispiel GmbH',
      },
      {
        name: 'Jane Smith',
        comment:
          'Ich hatte das Vergnügen, mit Stani an SHARKY zu arbeiten. Seine Liebe zum Detail und seine Kreativität machten das Projekt zu einem Erfolg.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Projektleiterin bei Beispiel AG',
      },
      {
        name: 'Alice Johnson',
        comment:
          'Stanis Fähigkeiten in Angular und TypeScript sind erstklassig. Er hat mit seinem Fachwissen einen großen Mehrwert in unser Team gebracht.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Senior Entwicklerin bei Beispiel GmbH',
      },
    ],
    en: [
      {
        name: 'John Doe',
        comment:
          'Stani is a dedicated and talented developer. His work on JOIN was impressive, especially the drag-and-drop functionality.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Senior Developer at Example GmbH',
      },
      {
        name: 'Jane Smith',
        comment:
          'I had the pleasure of working with Stani on SHARKY. His attention to detail and creativity made the project a success.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Project Lead at Example AG',
      },
      {
        name: 'Alice Johnson',
        comment:
          "Stani's skills in Angular and TypeScript are top-notch. He brought a lot of value to our team with his expertise.",
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Senior Developer at Example GmbH',
      },
    ],
    ru: [
      {
        name: 'Джон Доу',
        comment:
          'Станислав — целеустремлённый и талантливый разработчик. Его работа над JOIN впечатляет, особенно функция drag-and-drop.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Старший разработчик в Example GmbH',
      },
      {
        name: 'Джейн Смит',
        comment:
          'Мне было приятно работать со Станиславом над проектом SHARKY. Его внимание к деталям и креативность сделали проект успешным.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Руководитель проекта в Example AG',
      },
      {
        name: 'Алиса Джонсон',
        comment:
          'Навыки Станислава в Angular и TypeScript — на высшем уровне. Его профессионализм принёс нашей команде огромную пользу.',
        profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
        title: 'Старший разработчик в Example GmbH',
      },
    ],
  };

  /**
   * Aktuell angezeigte Kommentar-Liste basierend auf der aktuellen Sprache.
   */
  displayedComments = this.comments[this.currentLang];

  /**
   * Konstruktor
   *
   * @param langService - Service zur Sprachverwaltung
   * @param cdr - ChangeDetectorRef für manuelles Triggern von UI-Updates
   * @param zone - Angular NgZone für performante DOM-Aktualisierung außerhalb der Angular-Zone
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    /**
     * Reaktive Sprachumschaltung:
     * - Wechselt dynamisch die Kommentarlisten-Sprache
     * - Führt DOM-Updates außerhalb der Angular-Zone aus, um Performance zu verbessern
     */
    this.langService.lang$.subscribe((lang) => {
      this.zone.runOutsideAngular(() => {
        this.currentLang = lang;
        this.displayedComments = this.comments[lang];

        // Microtask zur sicheren UI-Aktualisierung nach Sprachwechsel
        queueMicrotask(() => {
          this.zone.run(() => this.cdr.detectChanges());
        });
      });
    });
  }

  /**
   * TrackBy-Funktion für *ngFor, um unnötige DOM-Neu-Renderings zu vermeiden.
   *
   * @param _ - Index des Kommentars
   * @param c - Aktuelles Kommentarobjekt
   * @returns Der eindeutige Name des Kommentators
   */
  trackByName = (_: number, c: any) => c.name;
}
