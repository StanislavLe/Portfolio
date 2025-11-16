/**
 * SkillsetComponent
 * ------------------
 *
 * Diese Komponente stellt die technischen Kernkompetenzen und Lerninteressen des Entwicklers dar.
 *
 * Hauptaufgaben:
 * - Darstellung der wichtigsten Frontend-Technologien (Skills)
 * - Mehrsprachige Textinhalte und Beschreibungen (Deutsch, Englisch, Russisch)
 * - Umschaltbarer Informationsbereich über Lerninteressen
 * - Dynamische Sprachaktualisierung über den `LanguageService`
 *
 * Besonderheiten:
 * - Reaktive Sprachumschaltung mit `ChangeDetectorRef`
 * - Klare Trennung zwischen Fachwissen (`skills`) und Lernzielen (`learning`)
 * - Responsive UI (über zugehörige SCSS-Dateien)
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, SupportedLang } from '../shared/language.service';

@Component({
  selector: 'app-skillset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skillset.component.html',
  styleUrls: ['./skillset.component.scss', './skillset.component.media.scss'],
})
export class SkillsetComponent implements OnInit {
  /**
   * Aktuell aktive Sprache (wird durch den `LanguageService` gesteuert).
   */
  currentLang: SupportedLang = 'de';

  /**
   * Enthält alle statischen und dynamischen Texte der Komponente in drei Sprachen.
   * Dazu zählen Überschriften, Einleitungstexte und Skill-Listen.
   */
  translations = {
    title: {
      de: 'Kernkompetenzen',
      en: 'Core Competencies',
      ru: 'Ключевые компетенции',
    },
    intro: {
      de: `In meinen Projekten habe ich mit modernen Frontend-Technologien gearbeitet – 
           von objektorientiertem JavaScript über API-Integrationen bis hin zu Datenvisualisierungen. 
           Dabei sammelte ich Erfahrung mit responsiven Layouts, interaktiven UIs sowie statischen und dynamischen Webanwendungen.`,
      en: `In my projects, I’ve worked with modern frontend technologies – 
           from object-oriented JavaScript and API integrations to data visualizations. 
           I’ve gained experience with responsive layouts, interactive UIs, and both static and dynamic web applications.`,
      ru: `В своих проектах я работал с современными фронтенд-технологиями — 
           от объектно-ориентированного JavaScript и интеграции API до визуализации данных. 
           Я приобрёл опыт работы с адаптивными интерфейсами и как статическими, так и динамическими веб-приложениями.`,
    },
    mindsetTitle: {
      de: 'Du findest nicht die Fähigkeit, die du suchst?',
      en: 'Don’t see the skill you’re looking for?',
      ru: 'Не нашли нужный навык?',
    },
    mindsetText: {
      de: 'Gerne können Sie mich kontaktieren. Ich freue mich darauf, mein bisheriges Wissen weiter auszubauen. Außerdem habe ich ein besonderes Interesse daran, folgendes zu lernen:',
      en: 'Feel free to contact me — I’m always eager to expand my skills. I’m especially interested in learning the following:',
      ru: 'Свяжитесь со мной — я всегда стремлюсь расширять свои знания. Особенно интересуюсь изучением следующих технологий:',
    },

    /**
     * Liste aller aktuell beherrschten Kerntechnologien.
     */
    skills: [
      { id: 'html', icon: 'assets/img/html.png', labels: { de: 'HTML', en: 'HTML', ru: 'HTML' } },
      { id: 'css', icon: 'assets/img/css.png', labels: { de: 'CSS', en: 'CSS', ru: 'CSS' } },
      { id: 'js', icon: 'assets/img/JavaScript.png', labels: { de: 'JavaScript', en: 'JavaScript', ru: 'JavaScript' } },
      { id: 'ts', icon: 'assets/img/TypeScript.png', labels: { de: 'TypeScript', en: 'TypeScript', ru: 'TypeScript' } },
      { id: 'angular', icon: 'assets/img/Angular.png', labels: { de: 'Angular', en: 'Angular', ru: 'Angular' } },
      { id: 'firebase', icon: 'assets/img/Firebase.png', labels: { de: 'Firebase', en: 'Firebase', ru: 'Firebase' } },
      { id: 'git', icon: 'assets/img/Git.png', labels: { de: 'Git', en: 'Git', ru: 'Git' } },
      { id: 'rest', icon: 'assets/img/REST-API.png', labels: { de: 'REST-API', en: 'REST API', ru: 'REST API' } },
      { id: 'scrum', icon: 'assets/img/SCRUM.png', labels: { de: 'SCRUM', en: 'SCRUM', ru: 'SCRUM' } },
      { id: 'material', icon: 'assets/img/Material-Design.png', labels: { de: 'Material Design', en: 'Material Design', ru: 'Material Design' } },
    ],

    /**
     * Liste der Technologien, die aktuell gelernt oder vertieft werden sollen.
     */
    learning: [
      { id: 'react', icon: 'assets/img/React.png', labels: { de: 'React', en: 'React', ru: 'React' } },
      { id: 'vue', icon: 'assets/img/Vue.Js.png', labels: { de: 'Vue.js', en: 'Vue.js', ru: 'Vue.js' } },
    ],
  };

  /**
   * Steuert die Sichtbarkeit des Info-Panels über Lerninteressen.
   */
  panelVisible = false;

  /**
   * Konstruktor
   *
   * @param langService - Reaktiver Service für Sprachverwaltung
   * @param cdr - Angular ChangeDetectorRef für manuelles Triggern von UI-Updates
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Abonniert den Sprachstrom (`lang$`) des `LanguageService`
   * und aktualisiert die aktuelle Sprache reaktiv bei jeder Änderung.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  /**
   * Öffnet oder schließt das Info-Panel.
   */
  togglePanel(): void {
    this.panelVisible = !this.panelVisible;
  }

  /**
   * Schließt das Info-Panel explizit.
   */
  closePanel(): void {
    this.panelVisible = false;
  }
}
