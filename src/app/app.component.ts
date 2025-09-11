import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home.component';

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

  constructor(private router: Router) {}

  onActivate(component: any) {
    if (component instanceof HomeComponent) {
      this.homeInstance = component;

      // SectionPager → AppComponent → Header + URL
      this.homeInstance.sectionChanged.subscribe((sectionId: string) => {
        this.currentSection = sectionId;

        // URL immer aktuell halten (History nicht zumüllen!)
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
    // Direkt scrollen
    if (this.homeInstance) {
      this.homeInstance.scrollTo(sectionId);
    }
  } else {
    // Navigation nach Home
    this.router.navigate(['/home'], { queryParams: { section: sectionId } }).then(() => {
      // Sobald Home geladen ist → scrollen
      setTimeout(() => {
        if (this.homeInstance) {
          this.homeInstance.scrollTo(sectionId);
        }
      }, 300); // kleine Verzögerung, bis View da ist
    });
  }
}


}
