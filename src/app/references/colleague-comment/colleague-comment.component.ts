import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-colleague-comment',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './colleague-comment.component.html',
  styleUrl: './colleague-comment.component.scss'
})

export class ColleagueCommentComponent {
  @Input() name!: string;
  @Input() comment!: string;
  @Input() profileLink?: string;
  @Input() title?: string;
}

