import {
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

type FooterVariant = 'home' | 'legal' | 'contact' | 'impressum' | 'privacy';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() variant: FooterVariant = 'home';
  @Output() navigateSection = new EventEmitter<string>();

  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  navigateAndScroll(path: string[]): void {
    this.router.navigate(path).then(success => {
      if (success && isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView;
        const body = this.document.body;

        requestAnimationFrame(() => {
          setTimeout(() => {
            //  Der Body ist der echte Scrollcontainer
            body.scrollTo({ top: 0, behavior: 'auto' });
          }, 50);
        });
      }
    });
  }



}
