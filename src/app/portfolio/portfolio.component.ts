import { Component } from '@angular/core';
import { ProjectComponent } from './project/project.component';


@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ProjectComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
 projects = [
    {
      title: 'Mein Shop',
      description: 'Ein cooles Shop-Projekt mit Angular.',
      imageUrl: 'assets/projects/shop.png',
      projectLink: 'https://meinshop.de'
    },
    {
      title: 'ToDo App',
      description: 'Produktivitäts-App für Aufgabenverwaltung.',
      imageUrl: 'assets/projects/todo.png',
      projectLink: 'https://meintodo.de'
    }
    ];
}
