import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService, SupportedLang } from '../shared/language.service';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  @Output() scrollToBottom = new EventEmitter<void>();
  currentLang: SupportedLang = 'de';

  translations = {
    title: {
      de: 'Über mich',
      en: 'About Me',
      ru: 'Обо мне',
    },
    intro: {
      de: `Hallo, ich bin Stanislav.<br>
           Mit Wurzeln in der Industrie habe ich den Weg ins Programmieren gefunden.
           Heute nutze ich genau diese Schnittstelle, um neue Ideen in smarte Lösungen zu verwandeln.`,
      en: `Hi, I’m Stanislav.<br>
           Coming from an industrial background, I found my way into programming.
           Today, I use this intersection to turn ideas into smart digital solutions.`,
      ru: `Привет, я Станислав.<br>
           Проработав в промышленности, я нашёл себя в программировании.
           Сегодня я использую этот опыт, чтобы превращать идеи в умные решения.`,
    },
    button: {
      de: 'Schreib mir',
      en: 'Write to me',
      ru: 'Напиши мне',
    },
    secretTitle: {
      de: 'Mehr über mich',
      en: 'More about me',
      ru: 'Больше обо мне',
    },
    traits: {
      de: [
        { icon: 'check_circle', text: 'Analytisch' },
        { icon: 'check_circle', text: 'Kreativ' },
        { icon: 'check_circle', text: 'Teamplayer' },
        { icon: 'check_circle', text: 'Detailverliebt' },
        { icon: 'check_circle', text: 'Motiviert' },
        { icon: 'check_circle', text: 'Neugierig' },
      ],
      en: [
        { icon: 'check_circle', text: 'Analytical' },
        { icon: 'check_circle', text: 'Creative' },
        { icon: 'check_circle', text: 'Team player' },
        { icon: 'check_circle', text: 'Detail-oriented' },
        { icon: 'check_circle', text: 'Motivated' },
        { icon: 'check_circle', text: 'Curious' },
      ],
      ru: [
        { icon: 'check_circle', text: 'Аналитичный' },
        { icon: 'check_circle', text: 'Креативный' },
        { icon: 'check_circle', text: 'Командный тип' },
        { icon: 'check_circle', text: 'Аккуратный' },
        { icon: 'check_circle', text: 'Мотивированный' },
        { icon: 'check_circle', text: 'Любознательный' },
      ],
    }
  };

  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.langService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.detectChanges(); // 👈 Echtzeit-Aktualisierung
    });
  }
}
