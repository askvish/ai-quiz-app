import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizBottomSheetComponent } from './quiz-bottom-sheet.component';

describe('QuizBottomSheetComponent', () => {
  let component: QuizBottomSheetComponent;
  let fixture: ComponentFixture<QuizBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
