import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {

@Output() scrollToBottom = new EventEmitter<void>();


}
