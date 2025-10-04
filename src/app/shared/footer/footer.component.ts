import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Erweitert: akzeptiere die Varianten, die in deinen Templates verwendet werden
type FooterVariant = 'home' | 'legal' | 'contact' | 'impressum' | 'privacy';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() variant: FooterVariant = 'home';
  @Output() navigateSection = new EventEmitter<string>();

  currentYear = new Date().getFullYear();

  // Mappe "contact" → Home-Modus (One-Pager), "impressum/privacy" → Legal-Modus
  get mode(): 'home' | 'legal' {
    if (this.variant === 'home' || this.variant === 'contact') return 'home';
    return 'legal';
  }

  // CSS-Klasse am <footer>
  get cssClass(): string {
    // wenn du spezielle Styles für contact/impressum/privacy brauchst, hier erweitern
    return this.mode;
  }

  go(e: Event, id: string) {
    e.preventDefault();
    this.navigateSection.emit(id);
  }

  
}





