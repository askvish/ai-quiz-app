import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../shared/services/quiz.service';
import { CommonModule } from '@angular/common';
import { Quiz } from './quiz.interface';
import { optionNumberDisplayNameMap } from '../../shared/utils/utils';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuizOptionComponent } from '../quiz-option/quiz-option.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, interval } from 'rxjs';
import { QuizDetails } from '../../shared/types/quiz-details.model';
import { UnicodeDecodePipe } from '../../shared/pipe/unicode-decode.pipe';

@Component({
  selector: 'app-quiz',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    QuizOptionComponent,
    UnicodeDecodePipe,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export default class QuizComponent implements OnInit, OnDestroy {
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

  breakpointObserver = inject(BreakpointObserver);
  screenSize = 'desktop';

  quizDetails!: QuizDetails;

  timerSubscription!: Subscription;
  timeLeft: number = 60;

  ngOnInit() {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.screenSize = 'mobile';
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.screenSize = 'tablet';
        } else {
          this.screenSize = 'desktop';
        }
      });

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
          difficulty: 'Easy',
        };
        this.getQuizQuestions(randomQuizDetails);
      }
    });

    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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
        this.resetTimer(); // Reset timer for the next question
      });
  }

  nextQuestion() {
    if (
      this.selectedAnswer ===
      this.quizData.questions[this.currentQuestionIndex].correct_answer
    ) {
      this.score = Math.min(this.score + 1, this.quizData.questions.length);
    }
    this.selectedAnswer = null;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.quizData.questions.length) {
      this.hasMoreQuestions = false;
    }
    this.resetTimer(); // Reset timer for the next question
  }

  loadMoreQuestions() {
    const quizDetails = {
      topic: this.quizData.topic,
      subTopic: this.quizData.subTopic,
      difficulty: this.quizData.difficulty,
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
      this.resetTimer();
    }
  }

  handleOptionSelected(option: string) {
    this.selectedAnswer = option;
  }

  startTimer() {
    this.timeLeft = 60;

    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--;

      if (this.timeLeft === 0) {
        this.timerSubscription.unsubscribe();
        this.nextQuestion(); // or auto-move to next question
      }
    });
  }

  resetTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.startTimer();
  }
}
