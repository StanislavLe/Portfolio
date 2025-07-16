import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ReferencesComponent } from './references/references.component';
import { SkillsetComponent } from './skillset/skillset.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkillsetComponent, ReferencesComponent, RouterOutlet, AboutMeComponent, ContactMeComponent, PortfolioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MeinPortfolio';
}
