import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleagueCommentComponent } from './colleague-comment.component';

describe('ColleagueCommentComponent', () => {
  let component: ColleagueCommentComponent;
  let fixture: ComponentFixture<ColleagueCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColleagueCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColleagueCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
