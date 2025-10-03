import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Sections für die Menüliste
import { SECTIONS } from '../sections.config';

type Variant = 'home' | 'legal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent implements OnChanges {
  @Input() variant: Variant = 'home';
  @Input() currentSection: string = 'hero';
  @Input() currentLanguage: string = 'de';
  @Input() justClicked = false;
  @Output() navigateSection = new EventEmitter<string>();
  @ViewChild('sidenav') sidenav!: MatSidenav;

  sections = SECTIONS;
  themeClass = 'hero'; 

  ngOnChanges(_: SimpleChanges) {
    this.themeClass = this.computeThemeClass();
  }

  private computeThemeClass(): string {
    if (this.variant === 'legal') return 'contact';
    const id = (this.currentSection || '').trim();
    if (!id || id === 'hero') return 'hero';
    return id;
  }

  navigateTo(id: string) {
    this.navigateSection.emit(id);
  }

  cycleLanguage() {
    this.justClicked = true;
    setTimeout(() => (this.justClicked = false), 150);
    this.currentLanguage = this.currentLanguage === 'en' ? 'de' : 'en';
  }

  go(e: Event, id: string) {
    e.preventDefault();
    this.navigateTo(id);
  }
}
