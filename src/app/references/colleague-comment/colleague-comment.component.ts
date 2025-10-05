import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { LanguageService, SupportedLang } from '../../shared/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-colleague-comment',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './colleague-comment.component.html',
  styleUrls: ['./colleague-comment.component.scss'],
})
export class ColleagueCommentComponent implements OnInit, OnDestroy {
  @Input() name!: string;
  @Input() comment!: string;
  @Input() profileLink?: string;
  @Input() title?: string;

  currentLang: SupportedLang = 'de';
  private sub?: Subscription;

  // Übersetzte statische Texte
  translations = {
    viewProfile: {
      de: 'LinkedIn-Profil ansehen »',
      en: 'View LinkedIn Profile »',
      ru: 'Посмотреть профиль LinkedIn »',
    },
  };

  constructor(private langService: LanguageService) {}

  ngOnInit() {
    this.sub = this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
