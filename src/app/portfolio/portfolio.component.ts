import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProjectComponent } from './project/project.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [NgFor, ProjectComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  projects = [
    {
      title: 'JOIN',
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories. ',
      imageUrl: 'assets/img/JOIN-SC.png',
      projectLink: 'https://join-386.developerakademie.net/Join/index.html',
      gitHubLink: 'https://github.com/SilverBlure/Join',
      color: '#F9AF42',
      iconUrl: 'assets/img/JOIN-emoji.png',
    skillset: ['HTML', 'CSS', 'Firebase', 'Angular', 'TypeScript']   // <— Array!
    },
    {
      title: 'SHARKY',
      description: 'A simple Jump-n-Run ggame based on an object-oriented approach. The player controls Sharky and helps him to collect coins while avoiding and fighting against enemies.',
      imageUrl: 'assets/img/SHARKY-SC.png',
      projectLink: 'https://stanislav-levin.developerakademie.net/SHARKY/index.html',
      gitHubLink: 'https://github.com/StanislavLe/Sharky',
      color: '#679AAC',
      iconUrl: 'assets/img/SHARKY-emoji.png',
    skillset: ['HTML', 'CSS', 'JavaScript']                           // <— Array!
    }
  ];
}
