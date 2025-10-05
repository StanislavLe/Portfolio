import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService, SupportedLang } from '../shared/language.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent implements OnInit {
  @Output() scrollToBottom = new EventEmitter<void>();

  currentLang: SupportedLang = 'de';

  translations = {
    greeting: {
      de: 'Hallo zusammen! Ich bin',
      en: 'Hello everyone! I am',
      ru: 'Всем привет! Я',
    },
    name: {
      de: 'Stanislav Levin',
      en: 'Stanislav Levin',
      ru: 'Станислав Левин',
    },
    role: {
      de: 'Frontend Entwickler',
      en: 'Frontend Developer',
      ru: 'Фронтенд-разработчик',
    },
    button: {
      de: 'Kontaktiere mich',
      en: 'Get in Touch',
      ru: 'Связаться со мной',
    },
  };

  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef // ✅ Wichtig!
  ) {}

  ngOnInit() {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges(); // 👈 erzwingt Neurendern bei Sprachwechsel
    });
  }
}
