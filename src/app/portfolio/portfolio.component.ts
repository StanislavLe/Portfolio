import { Component } from '@angular/core';
import { ProjectComponent } from './project/project.component';
import { trigger, style, animate, transition } from '@angular/animations';

type Project = {
  title: string;
  description: string;
  imageUrl: string;
  projectLink?: string;
  gitHubLink?: string;
  color: string;
  iconUrl?: string;
  skillset: string[];
  hoverInfo: string;
};

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ProjectComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  animations: [
    trigger('slideFade', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class PortfolioComponent {
  projects: Project[] = [
    {
      title: 'JOIN',
      description: 'Task-Manager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben mit Drag-and-Drop-Funktionen, weise Benutzer und Kategorien zu.',
      imageUrl: 'assets/img/JOIN-SC.png',
      projectLink: 'https://join-386.developerakademie.net/Join/index.html',
      gitHubLink: 'https://github.com/SilverBlure/Join',
      color: '#F9AF42',
      iconUrl: 'assets/img/JOIN-emoji.png',
      skillset: ['HTML', 'CSS', 'Firebase', 'Angular', 'TypeScript'],
      hoverInfo: 'Ein Task-Manager, inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben mit Drag-and-Drop-Funktionen und weise Benutzer sowie Kategorien zu.'
    },
    {
      title: 'SHARKY',
      description: 'Ein einfaches Jump-’n’-Run-Spiel auf objektorientierter Basis. Der Spieler steuert Sharky und hilft ihm, Münzen zu sammeln, während er Gegnern ausweicht und gegen sie kämpft.',
      imageUrl: 'assets/img/SHARKY-SC.png',
      projectLink: 'https://stanislav-levin.developerakademie.net/SHARKY/index.html',
      gitHubLink: 'https://github.com/StanislavLe/Sharky',
      color: '#679AAC',
      iconUrl: 'assets/img/SHARKY-emoji.png',
      skillset: ['HTML', 'CSS', 'JavaScript'],
      hoverInfo: 'Ein einfaches Jump-’n’-Run-Spiel auf objektorientierter Basis. Der Spieler steuert Sharky, sammelt Münzen und muss Gegnern ausweichen oder sie bekämpfen.'
    }
  ];

  currentIndex = 0;

  get current(): Project {
    return this.projects[this.currentIndex];
  }

  prevProject() {
    if (!this.projects.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }

  nextProject() {
    if (!this.projects.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }
}
