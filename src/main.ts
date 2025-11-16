import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, ExtraOptions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

initViewportHeight();


// viewport-fix.util.ts
export function initViewportHeight() {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);
}

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', 
  anchorScrolling: 'enabled',           
  scrollOffset: [0, 0],
};

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes, routerOptions)),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
  ],
});
