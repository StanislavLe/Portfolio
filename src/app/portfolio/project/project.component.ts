import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;
  @Input() projectLink?: string;
  @Input() color!: string;
  @Input() iconUrl?: string;
  @Input() gitHubLink?: string;
  @Input() skillset: string[] = [];
  @Input() hoverInfo!: string;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onPrev() { this.prev.emit(); }
  onNext() { this.next.emit(); }

   trackBySkill(_index: number, skill: string): string {
    return skill; // nutzt den String selbst als eindeutigen Key
  }
}
