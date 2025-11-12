/**
 * ProjectComponent
 * -----------------
 *
 * Diese Komponente repräsentiert ein einzelnes Projekt innerhalb der Portfolio-Sektion.
 * Sie zeigt Projektdetails, Technologien, Vorschau-Bilder und Links (Live- & Code-Links) an.
 *
 * Hauptaufgaben:
 * - Dynamische Darstellung eines Projekts (Titel, Beschreibung, Technologien, Links)
 * - Mehrsprachige Texte und Labels (über `LanguageService`)
 * - Steuerung der Projekt-Navigation (vorheriges / nächstes Projekt)
 * - Reaktive Aktualisierung bei Sprachwechsel
 *
 * Besonderheiten:
 * - Wiederverwendbare Eingabeparameter (Inputs)
 * - Klare Output-Events zur Navigation
 * - Effiziente Change Detection mit `ChangeDetectorRef`
 * - TrackBy-Funktion für performante NgFor-Iterationen
 */

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
  /**
   * Titel des Projekts (wird im Kopfbereich angezeigt).
   */
  @Input() title!: string;

  /**
   * Beschreibungstext des Projekts (mehrsprachig übergeben).
   */
  @Input() description!: string;

  /**
   * Bild-URL oder Pfad zur Projektvorschau.
   */
  @Input() imageUrl!: string;

  /**
   * Optionaler Link zur Live-Version des Projekts.
   */
  @Input() projectLink?: string;

  /**
   * Hintergrundfarbe oder Akzentfarbe für die Projektkarte.
   */
  @Input() color!: string;

  /**
   * Optionales Icon oder Logo, das das Projekt symbolisiert.
   */
  @Input() iconUrl?: string;

  /**
   * Optionaler GitHub-Link zum Quellcode des Projekts.
   */
  @Input() gitHubLink?: string;

  /**
   * Liste der verwendeten Technologien (Skillset) im Projekt.
   */
  @Input() skillset: string[] = [];

  /**
   * Text oder Tooltip, der beim Hover über das Projekt angezeigt wird.
   */
  @Input() hoverInfo!: string;

  /**
   * EventEmitter zum Wechsel auf das vorherige Projekt.
   */
  @Output() prev = new EventEmitter<void>();

  /**
   * EventEmitter zum Wechsel auf das nächste Projekt.
   */
  @Output() next = new EventEmitter<void>();

  /**
   * Aktuell aktive Sprache der Anwendung.
   */
  currentLang: SupportedLang = 'de';

  /**
   * Mehrsprachige Texte für UI-Elemente wie Buttons und Navigation.
   */
  translations = {
    live: {
      de: 'Live testen',
      en: 'Live test',
      ru: 'Открыть',
    },
    github: {
      de: 'Code Link',
      en: 'View Code',
      ru: 'Открыть код',
    },
    prev: {
      de: '<< Vorherige Seite',
      en: '<< Previous page',
      ru: '<< Назад',
    },
    next: {
      de: 'Nächste Seite >>',
      en: 'Next page >>',
      ru: 'Вперёд >>',
    },
  };

  /**
   * Konstruktor
   *
   * @param langService - Service, der die aktuelle Sprache bereitstellt
   * @param cdr - ChangeDetectorRef für manuelles UI-Update bei Sprachwechsel
   */
  constructor(
    private langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Lifecycle Hook – `ngOnInit`
   *
   * Abonniert Änderungen der aktuellen Sprache über den `LanguageService`.
   * Bei Sprachwechsel wird das UI reaktiv aktualisiert.
   */
  ngOnInit(): void {
    this.langService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  /**
   * Löst das `prev`-Event aus, um das vorherige Projekt anzuzeigen.
   */
  onPrev(): void {
    this.prev.emit();
  }

  /**
   * Löst das `next`-Event aus, um das nächste Projekt anzuzeigen.
   */
  onNext(): void {
    this.next.emit();
  }

  /**
   * TrackBy-Funktion für *ngFor, um unnötige DOM-Neu-Renderings zu vermeiden.
   *
   * @param _index - Index des Elements
   * @param skill - Name oder ID des Skills
   * @returns Der Skill selbst (als eindeutiger Schlüssel)
   */
  trackBySkill(_index: number, skill: string): string {
    return skill;
  }
}
