import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImpressumComponent } from './legal/impressum/impressum.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

