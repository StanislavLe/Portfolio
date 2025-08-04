import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPagerComponent } from './section-pager.component';

describe('SectionPagerComponent', () => {
  let component: SectionPagerComponent;
  let fixture: ComponentFixture<SectionPagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionPagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
