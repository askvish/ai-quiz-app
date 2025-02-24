import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMarketplaceComponent } from './quiz-marketplace.component';

describe('QuizMarketplaceComponent', () => {
  let component: QuizMarketplaceComponent;
  let fixture: ComponentFixture<QuizMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizMarketplaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
