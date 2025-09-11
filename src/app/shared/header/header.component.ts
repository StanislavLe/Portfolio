import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SECTIONS } from '../sections.config';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() currentSection: string = '';
  @Output() sectionSelected = new EventEmitter<string>();

  sections = SECTIONS;

  languages = ['de', 'en', 'ru'];
  currentLanguage = 'de';
  justClicked = false;

  constructor(private router: Router) {}

  cycleLanguage() {
    const currentIndex = this.languages.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % this.languages.length;
    this.currentLanguage = this.languages[nextIndex];
    this.justClicked = true;
    setTimeout(() => this.justClicked = false, 150);
  }

navigateTo(sectionId: string) {
  if (!this.router.url.startsWith('/home')) {
    this.router.navigate(['/home'], { queryParams: { section: sectionId } });
  } else {
    this.sectionSelected.emit(sectionId);
  }
}

}
