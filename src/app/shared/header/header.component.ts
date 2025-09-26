import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SECTIONS } from '../sections.config';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

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
  @ViewChild('sidenav') sidenav!: MatSidenav;   // <-- Referenz auf dein MatSidenav

  sections = SECTIONS;

  languages = ['de', 'en', 'ru'];
  currentLanguage = 'de';
  justClicked = false;

  // Extra state für Impressum / Privacy
  isLegalPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.isLegalPage = url.startsWith('/impressum') || url.startsWith('/privacy-policy');
      });
  }

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
    this.forceRedrawAfterClose();
  }

  /** 👇 Safari-Fix hier */
  forceRedrawAfterClose() {
    this.sidenav.close().then(() => {
      const header = document.querySelector('.mainToolbar') as HTMLElement;
      if (header) {
        header.style.display = 'none';
        void header.offsetHeight; // Reflow erzwingen
        header.style.display = '';
      }
    });
  }

}
