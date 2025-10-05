import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule }    from '@angular/material/icon';
import { MatListModule }    from '@angular/material/list';
import { MatButtonModule }  from '@angular/material/button';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentSection: string = 'hero';
  isLegalPage: boolean = false;

  private sub = new Subscription();

  constructor(
    private router: Router,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
          this.applyHeaderStyleFromRoute();
          this.cdr.markForCheck();
        })
    );

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('pageshow', this.onPageShow);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('pageshow', this.onPageShow);
    }
  }

  onHeaderSectionSelected(section: string) {
    this.currentSection = section;
  }

  onActivate(_cmp: unknown) {
  }

  private onPageShow = (e: PageTransitionEvent) => {
    if ((e as any).persisted) {
      this.ngZone.run(() => {
        this.applyHeaderStyleFromRoute();
        this.cdr.detectChanges();
      });
    }
  };

  private applyHeaderStyleFromRoute() {
    const deepest = this.getDeepest(this.ar);
    const style = deepest.snapshot.data?.['headerStyle'] as string | undefined;

    if (style === 'contact') {
      this.isLegalPage = true;
    } else {
      this.isLegalPage = false;
      this.currentSection = style ?? 'hero';
    }
  }

  private getDeepest(r: ActivatedRoute): ActivatedRoute {
    while (r.firstChild) r = r.firstChild;
    return r;
  }
}
