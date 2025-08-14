import { Component } from '@angular/core';
import { ColleagueCommentComponent } from './colleague-comment/colleague-comment.component';
import { NgFor } from '@angular/common';                     // <-- hinzufügen

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [ColleagueCommentComponent, NgFor],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss'
})
export class ReferencesComponent {
  comments = [
    {
      name: 'John Doe',
      comment: 'Stani is a dedicated and talented developer. His work on JOIN was impressive, especially the drag-and-drop functionality.',
      profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
      title: 'Senior Developer at bsp'
    },
    {
      name: 'Jane Smith',
      comment: 'I had the pleasure of working with Stani on SHARKY. His attention to detail and creativity made the project a success.',
      profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
      title: 'Senior Developer at bsp'
    },
    {
      name: 'Alice Johnson',
      comment: 'Stani\'s skills in Angular and TypeScript are top-notch. He brought a lot of value to our team with his expertise.',
      profileLink: 'https://www.linkedin.com/in/stanislav-levin-881ab32b5',
      title: 'Senior Developer at bsp'
    }
  ];

    trackByName = (_: number, c: any) => c.name;

}
