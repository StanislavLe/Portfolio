/**
 * PortfolioComponent
 * -------------------
 *
 * Diese Komponente präsentiert eine Sammlung von Projekten im Portfolio-Bereich der Website.
 * Sie nutzt die `ProjectComponent`, um einzelne Projekte anzuzeigen, und verwaltet die Navigation zwischen ihnen.
 *
 * Hauptaufgaben:
 * - Anzeige einer rotierenden Liste von Projekten mit Animation
 * - Steuerung der Projekt-Navigation (vor/zurück)
 * - Dynamische Textanpassung bei Sprachwechsel
 * - Integration der Kind-Komponente `ProjectComponent`
 *
 * Besonderheiten:
 * - Animierte Übergänge mit Angular Animations API
 * - Reaktives Sprachhandling über `LanguageService`
 * - Type-sicheres Projektmodell mit Sprachabhängigen Beschreibungen
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { trigger, style, animate, transition } from '@angular/animations';
import { LanguageService, SupportedLang } from '../shared/language.service';

/**
 * Interface für ein einzelnes Projektobjekt.
 * Enthält alle mehrsprachigen Beschreibungen, Links und Metadaten.
 */
type Project = {
  title: string;
  description: { [lang in SupportedLang]: string };
  imageUrl: string;
  projectLink?: string;
  gitHubLink?: string;
  color: string;
  iconUrl?: string;
  skillset: string[];
  hoverInfo: { [lang in SupportedLang]: string };
};

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ProjectComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],

  /**
   * Definition der Slide-Animationslogik:
   * - Animiert den Wechsel zwischen Projekten horizontal mit Fading.
   * - Unterschiedliche Bewegungsrichtungen für Vorwärts- und Rückwärts-Navigation.
   */
  animations: [
    trigger('slideFade', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class PortfolioComponent implements OnInit {
  /**
   * Aktuell aktive Sprache der Anwendung.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Index des aktuell angezeigten Projekts in der Projektliste.
   */
  currentIndex = 0;

  /**
   * Überschriften- und Einleitungstexte für die Portfolio-Sektion.
   * Mehrsprachig verwaltet.
   */
  headerTranslations = {
    title: {
      de: 'Meine Werke',
      en: 'My Projects',
      ru: 'Мои работы',
    },
    intro: {
      de: 'Entdecke hier eine Auswahl meiner Arbeiten – interagiere mit den Projekten und erlebe meine Fähigkeiten in Aktion.',
      en: 'Explore a selection of my work – interact with the projects and see my skills in action.',
      ru: 'Ознакомьтесь с подборкой моих проектов — взаимодействуйте с ними и посмотрите мои навыки в действии.',
    },
  };

  /**
   * Liste aller angezeigten Projekte.
   * Jedes Projekt enthält mehrsprachige Texte, Icons, Technologien und Links.
   */
  projects: Project[] = [
    {
      title: 'JOIN',
      description: {
        de: 'Task-Manager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben mit Drag-and-Drop-Funktionen, weise Benutzer und Kategorien zu.',
        en: 'Task manager inspired by the Kanban system. Create and organize tasks with drag-and-drop, assign users and categories.',
        ru: 'Менеджер задач, вдохновленный системой Kanban. Создавайте и организуйте задачи с помощью drag-and-drop, назначайте пользователей и категории.',
      },
      imageUrl: 'assets/img/JOIN-SC.png',
      projectLink: 'https://join-386.developerakademie.net/Join/index.html',
      gitHubLink: 'https://github.com/SilverBlure/Join',
      color: '#F9AF42',
      iconUrl: 'assets/img/JOIN-emoji.png',
      skillset: ['HTML', 'CSS', 'Firebase', 'Angular', 'TypeScript'],
      hoverInfo: {
        de: 'Ein Task-Manager mit Drag-and-Drop-Funktionalität und Benutzerverwaltung.',
        en: 'A task manager with drag-and-drop functionality and user management.',
        ru: 'Менеджер задач с функцией drag-and-drop и управлением пользователями.',
      },
    },
    {
      title: 'SHARKY',
      description: {
        de: 'Ein einfaches Jump-’n’-Run-Spiel auf objektorientierter Basis. Steuere Sharky, sammle Münzen und weiche Gegnern aus.',
        en: 'A simple object-oriented jump’n’run game. Control Sharky, collect coins, and avoid enemies.',
        ru: 'Простая игра в жанре Jump’n’Run на объектно-ориентированной основе. Управляйте Шарки, собирайте монеты и избегайте врагов.',
      },
      imageUrl: 'assets/img/SHARKY-SC.png',
      projectLink: 'https://sharky.stanislav-levin.de',
      gitHubLink: 'https://github.com/StanislavLe/Sharky',
      color: '#679AAC',
      iconUrl: 'assets/img/SHARKY-emoji.png',
      skillset: ['HTML', 'CSS', 'JavaScript'],
      hoverInfo: {
        de: 'Ein Jump’n’Run-Spiel mit Münzen, Gegnern und Spaßfaktor!',
        en: 'A fun jump’n’run game with coins, enemies, and action!',
        ru: 'Весёлая Jump’n’Run игра с монетами, врагами и экшеном!',
      },
    },
  ];

  /**
   * Konstruktor
   *
   * @param langService - Service zur Sprachverwaltung
   * @param cdr - ChangeDetectorRef für manuelles UI-Update bei Sprachänderung
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Abonniert die aktuelle Sprache und aktualisiert dynamisch die Anzeige,
   * wenn der Benutzer die Sprache ändert.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  /**
   * Liefert das aktuell sichtbare Projekt basierend auf dem aktuellen Index.
   */
  get current(): Project {
    return this.projects[this.currentIndex];
  }

  /**
   * Navigiert zum vorherigen Projekt in der Liste.
   * Unterstützt zyklische Navigation (am Anfang → letztes Projekt).
   */
  prevProject(): void {
    if (!this.projects.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }

  /**
   * Navigiert zum nächsten Projekt in der Liste.
   * Unterstützt zyklische Navigation (am Ende → erstes Projekt).
   */
  nextProject(): void {
    if (!this.projects.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }
}
