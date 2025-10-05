import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LanguageService, SupportedLang } from '../../shared/language.service';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
})
export class ImpressumComponent implements OnInit {
  currentLang: SupportedLang = 'de';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private langService: LanguageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0 });
    }

    this.langService.lang$.subscribe((lang) => {
      this.zone.runOutsideAngular(() => {
        this.currentLang = lang;
        queueMicrotask(() => this.zone.run(() => this.cdr.detectChanges()));
      });
    });
  }

  translations = {
    title: {
      de: 'Impressum',
      en: 'Legal Notice',
      ru: 'Импрессум (Юридическая информация)',
    },
    section1: {
      de: 'Angaben gemäß § 5 TMG:',
      en: 'Information according to § 5 TMG:',
      ru: 'Сведения в соответствии с § 5 TMG:',
    },
    contact: {
      de: 'Kontakt:',
      en: 'Contact:',
      ru: 'Контакты:',
    },
    responsible: {
      de: 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:',
      en: 'Responsible for the content according to § 55 Abs. 2 RStV:',
      ru: 'Ответственный за содержание в соответствии с § 55 Abs. 2 RStV:',
    },
    disclaimerTitle: {
      de: 'Haftungsausschluss',
      en: 'Disclaimer',
      ru: 'Отказ от ответственности',
    },
    disclaimerText: {
      de: 'Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.',
      en: 'Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.',
      ru: 'Несмотря на тщательную проверку содержимого, мы не несем ответственности за содержание внешних ссылок. За содержание ссылок несут ответственность их операторы.',
    },
    copyrightTitle: {
      de: 'Urheberrecht',
      en: 'Copyright',
      ru: 'Авторское право',
    },
    copyrightText: {
      de: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
      en: 'The content and works created by the site operators are subject to German copyright law. Reproduction, editing, distribution, and any kind of use outside the limits of copyright require the written consent of the respective author or creator.',
      ru: 'Содержимое и произведения, созданные владельцами сайта, защищены немецким законодательством об авторском праве. Воспроизведение, обработка, распространение и любое использование за пределами авторских прав требуют письменного согласия автора или создателя.',
    },
  };
}
