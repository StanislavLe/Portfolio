/**
 * ColleagueCommentComponent
 * --------------------------
 *
 * Diese Komponente repräsentiert eine einzelne Referenz (einen Kommentar)
 * innerhalb der `ReferencesComponent`.
 * Sie zeigt den Namen, das Feedback, den beruflichen Titel und optional
 * einen LinkedIn-Link eines Kollegen oder Partners an.
 *
 * Hauptaufgaben:
 * - Darstellung eines individuellen Testimonials
 * - Dynamische Sprachumschaltung für UI-Elemente (z. B. Profil-Link)
 * - Lifecycle-Management mit sauberem Unsubscribe bei Zerstörung der Komponente
 *
 * Besonderheiten:
 * - Reaktive Sprachaktualisierung über `LanguageService`
 * - Kompakte, wiederverwendbare Struktur für modulare Referenzenanzeige
 * - Sauberes Ressourcenmanagement über `OnDestroy`
 */

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
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
  /**
   * Name des Kollegen, der das Feedback gegeben hat.
   */
  @Input() name!: string;

  /**
   * Der eigentliche Kommentartext.
   */
  @Input() comment!: string;

  /**
   * Optionaler Link zum LinkedIn-Profil des Kollegen.
   */
  @Input() profileLink?: string;

  /**
   * Berufliche Position oder Rolle des Kollegen.
   */
  @Input() title?: string;

  /**
   * Aktuell aktive Sprache (Standard: Deutsch).
   * Wird automatisch vom `LanguageService` aktualisiert.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Subscription-Referenz für das Sprach-Observable.
   * Wird in `ngOnDestroy()` sauber beendet, um Speicherlecks zu vermeiden.
   */
  private sub?: Subscription;

  /**
   * Mehrsprachige Texte für UI-Elemente.
   */
  translations = {
    viewProfile: {
      de: 'LinkedIn-Profil ansehen »',
      en: 'View LinkedIn Profile »',
      ru: 'Посмотреть профиль LinkedIn »',
    },
  };

  /**
   * Konstruktor
   *
   * @param langService - Service zur Verwaltung der aktuell ausgewählten Sprache
   */
  constructor(private langService: LanguageService) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Abonniert die aktuelle Sprache aus dem `LanguageService`
   * und speichert die Subscription zur späteren Bereinigung.
   */
  ngOnInit(): void {
    this.sub = this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  /**
   * Lifecycle Hook – `ngOnDestroy`
   *
   * Trennt alle Subscriptions, um Speicherlecks zu vermeiden.
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
