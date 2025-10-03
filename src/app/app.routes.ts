// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LegalComponent } from './legal/legal.component';
import { ImpressumComponent } from './legal/impressum/impressum.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'legal',
    component: LegalComponent,
    children: [
      { path: 'impressum', component: ImpressumComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: '', redirectTo: 'impressum', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
