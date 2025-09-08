import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// deine eigenen Components
import { SectionPagerComponent } from './shared/section-pager/section-pager.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SectionPagerComponent,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Stanislav Levin';
  currentSection: string = 'hero';

  @ViewChild('pager') pager!: SectionPagerComponent;

  onSectionChanged(sectionId: string) {
    this.currentSection = sectionId;
  }

  onHeaderSectionSelected(sectionId: string) {
    const index = this.pager.sections.findIndex(s => s.id === sectionId);
    if (index >= 0) {
      this.pager.scrollToSection(index);
    }
  }
}
