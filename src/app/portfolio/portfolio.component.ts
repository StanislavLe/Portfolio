import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { trigger, style, animate, transition } from '@angular/animations';
import { LanguageService, SupportedLang } from '../shared/language.service';

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
  currentLang: SupportedLang = 'de';
  currentIndex = 0;

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
      projectLink: 'https://stanislav-levin.developerakademie.net/SHARKY/index.html',
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

  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  get current(): Project {
    return this.projects[this.currentIndex];
  }

  prevProject() {
    if (!this.projects.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }

  nextProject() {
    if (!this.projects.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }
}
