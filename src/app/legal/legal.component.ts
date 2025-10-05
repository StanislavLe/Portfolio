import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './legal.component.html',
})
export class LegalComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

 ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const win = this.document.defaultView;
        win?.scrollTo({ top: 0, behavior: 'auto' });
      }, 50);
    });
  }
}

private scrollToTop(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  const body = this.document.body;
  body.scrollTo({ top: 0, behavior: 'auto' });
}

}
