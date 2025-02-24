import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../shared/services/quiz.service';
import { CommonModule } from '@angular/common';
import { Quiz } from './quiz.interface';
import { optionNumberDisplayNameMap } from '../../shared/utils/utils';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QuizOptionComponent } from '../quiz-option/quiz-option.component';
import { QuizDetails } from '../../shared/types/quiz-details.model';

@Component({
  selector: 'app-quiz',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    QuizOptionComponent,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export default class QuizComponent implements OnInit {
  quizData!: Quiz;
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  isLoading = false;
  hasMoreQuestions = true;

  optionNumberDisplayNameMap = optionNumberDisplayNameMap;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  quizService = inject(QuizService);

  quizDetails!: QuizDetails;

  ngOnInit() {
    // Receive parameters without Observable
    let topic = this.activatedRoute.snapshot.paramMap.get('technology');
    this.activatedRoute.queryParams.subscribe((params) => {
      this.quizDetails = params as QuizDetails;
      if (topic && topic === this.quizDetails?.topic) {
        this.getQuizQuestions(this.quizDetails);
      } else {
        const randomQuizDetails = {
          topic: 'Angular',
          subTopic: '',
          difficulty: 'easy',
        };
        this.getQuizQuestions(randomQuizDetails);
      }
    });
  }

  getQuizQuestions(quizDetails: QuizDetails, loadMore = false) {
    this.isLoading = true;
    this.quizService
      .getQuizQuestions(quizDetails, loadMore)
      .subscribe((response) => {
        this.quizData =
          this.quizData?.questions?.length > 0
            ? {
                ...this.quizData,
                questions: [...this.quizData.questions, ...response.questions],
              }
            : (response as Quiz);
        this.isLoading = false;
      });
  }

  nextQuestion() {
    if (
      this.selectedAnswer ===
      this.quizData.questions[this.currentQuestionIndex].correct_answer
    ) {
      this.score++;
    }
    this.selectedAnswer = null;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.quizData.questions.length) {
      this.hasMoreQuestions = false;
    }
  }

  loadMoreQuestions() {
    const quizDetails = {
      topic: this.quizData.topic,
      subTopic: '',
      difficulty: 'medium',
    };
    this.getQuizQuestions(quizDetails, true);
  }

  onSubmitQuiz() {
    this.quizService.setScore(this.score);
    this.router.navigate(['home/result']);
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.selectedAnswer = null;
      this.currentQuestionIndex--;
    }
  }

  handleOptionSelected(option: string) {
    this.selectedAnswer = option;
  }
}
