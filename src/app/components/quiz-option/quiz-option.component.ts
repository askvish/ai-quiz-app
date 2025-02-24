import { CommonModule } from '@angular/common';
import { Component, Input, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quiz-option',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './quiz-option.component.html',
  styleUrl: './quiz-option.component.scss',
})
export class QuizOptionComponent {
  // @Input() option: string;
  option = input.required<string>();
  optionNo = input.required<number>();
  correctAnswer = input.required<string>();
  selectedAnswer = input.required<string | null>();

  optionNumberDisplayNameMap: Record<number, string> = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
  };

  optionSelected = output<string>();

  spitOption() {
    this.optionSelected.emit(this.option());
  }

  // {
  //   correct: selectedAnswer !== null && selectedAnswer === correctAnswer,
  //   wrong: selectedAnswer !== null && selectedAnswer !== correctAnswer
  // }
  /** Get the CSS class for the option */
  getOptionClass(): string {
    if (!this.selectedAnswer()) return ''; // No selection yet

    if (this.option() === this.selectedAnswer()) {
      return this.option() === this.correctAnswer() ? 'correct' : 'incorrect'; // Green for correct, red for incorrect
    }

    return this.option() === this.correctAnswer() ? 'correct' : ''; // Mark correct answer green after selection
  }

  isSelectedOptionCorrect() {
    return (
      this.selectedAnswer() !== null &&
      this.selectedAnswer() === this.correctAnswer()
    );
  }

  isSelectedOptionIncorrect() {
    return (
      this.selectedAnswer() !== null &&
      this.selectedAnswer() !== this.correctAnswer()
    );
  }
}
