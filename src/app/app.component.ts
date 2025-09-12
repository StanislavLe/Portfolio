import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Stanislav Levin';
  currentSection: string = 'hero';
  private homeInstance?: HomeComponent;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // 👇 Scroll-to-top nur im Browser für Impressum & Privacy Policy
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (!this.isBrowser) return;

        const url = event.urlAfterRedirects;
        if (url.startsWith('/impressum') || url.startsWith('/privacy-policy')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }

  onActivate(component: any) {
    if (component instanceof HomeComponent) {
      this.homeInstance = component;

      // SectionPager → AppComponent → Header + URL
      this.homeInstance.sectionChanged.subscribe((sectionId: string) => {
        this.currentSection = sectionId;

        this.router.navigate([], {
          queryParams: { section: sectionId },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      });
    }
  }

  onHeaderSectionSelected(sectionId: string) {
    if (this.router.url.startsWith('/home')) {
      if (this.homeInstance) {
        this.homeInstance.scrollTo(sectionId);
      }
    } else {
      this.router.navigate(['/home'], { queryParams: { section: sectionId } }).then(() => {
        setTimeout(() => {
          if (this.homeInstance) {
            this.homeInstance.scrollTo(sectionId);
          }
        }, 300);
      });
    }
  }
}
