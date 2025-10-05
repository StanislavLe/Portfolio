import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { LanguageService, SupportedLang } from '../../shared/language.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
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

  currentLang: SupportedLang = 'de';

  translations = {
    live: {
      de: 'Live ansehen',
      en: 'View Live',
      ru: 'Открыть онлайн',
    },
    github: {
      de: 'Code ansehen',
      en: 'View Code',
      ru: 'Посмотреть код',
    },
    prev: {
      de: '<< Vorheriges Projekt',
      en: '<< Previous project',
      ru: '<< Предыдущий проект',
    },
    next: {
      de: 'Nächstes Projekt >>',
      en: 'Next project >>',
      ru: 'Следующий проект >>',
    },
  };

  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges(); // Live-Update der Texte
    });
  }

  onPrev() {
    this.prev.emit();
  }

  onNext() {
    this.next.emit();
  }

  trackBySkill(_index: number, skill: string): string {
    return skill;
  }
}
