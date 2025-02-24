import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-quiz-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './quiz-bottom-sheet.component.html',
  styleUrl: './quiz-bottom-sheet.component.scss',
})
export class QuizBottomSheetComponent {
  quizTopic!: string;
  quizSubTopic!: string;

  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  selectedDifficulty = this.difficulties[0];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<QuizBottomSheetComponent>
  ) {}

  createQuiz() {
    this.bottomSheetRef.dismiss({
      topic: this.quizTopic,
      subTopic: this.quizSubTopic,
      difficulty: this.selectedDifficulty,
    });
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
