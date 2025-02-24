import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { QuizBottomSheetComponent } from '../quiz-bottom-sheet/quiz-bottom-sheet.component';
import { quizCategories } from '../../shared/utils/utils';

@Component({
  selector: 'app-quiz-marketplace',
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: './quiz-marketplace.component.html',
  styleUrl: './quiz-marketplace.component.scss',
})
export default class QuizMarketplaceComponent {
  router = inject(Router);
  bottomSheet = inject(MatBottomSheet);

  quizCategories = quizCategories;

  onStartQuiz(technology: string) {
    this.router.navigate(['home/quiz', technology], {
      queryParams: { topic: technology, subTopic: '', difficulty: 'Easy' },
    });
  }

  openBottomSheet() {
    const bottomSheetRef = this.bottomSheet.open(QuizBottomSheetComponent);

    bottomSheetRef
      .afterDismissed()
      .subscribe(
        (result: { topic: string; subTopic: string; difficulty: string }) => {
          if (result) {
            this.router.navigate(['home/quiz', result.topic], {
              queryParams: result,
            });
          }
        }
      );
  }
}
