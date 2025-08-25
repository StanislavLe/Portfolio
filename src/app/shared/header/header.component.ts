import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})


export class HeaderComponent {
  @Input() currentSection: string = '';

  languages = ['de', 'en', 'ru'];
  currentLanguage = 'de';
  justClicked = false;

  cycleLanguage() {
    const currentIndex = this.languages.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % this.languages.length;
    this.currentLanguage = this.languages[nextIndex];
    this.justClicked = true;
    setTimeout(() => this.justClicked = false, 150); 
  }

}


