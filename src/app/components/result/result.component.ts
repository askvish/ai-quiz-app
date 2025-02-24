import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../shared/services/quiz.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-result',
  imports: [MatButtonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export default class ResultComponent implements OnInit {
  score!: number;

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.score = this.quizService.getScore();
  }

  gotToHome() {
    this.router.navigate(['home']);
  }
}
