import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;
  @Input() projectLink?: string;
}
