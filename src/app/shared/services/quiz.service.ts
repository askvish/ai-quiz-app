import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { ResponseModel } from './response.model';
import { Question, Quiz } from '../../components/quiz/quiz.interface';
import {
  API_KEY,
  API_URL,
  extractJson,
  getRequestBody,
  quizCategories,
} from '../utils/utils';
import { QuizDetails } from '../types/quiz-details.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = API_URL;
  private readonly apiKey = API_KEY;

  private readonly quizCategories = quizCategories;

  // Cache: Key (Topic) -> Value (Array of Questions)
  private quizCache = new Map<string, Question[]>();

  // Stream to store questions globally (Observable for real-time updates)
  private questionsSubject = new BehaviorSubject<Map<string, Question[]>>(
    new Map()
  );
  // public questions$ = this.questionsSubject.asObservable();

  getQuizQuestions(
    quizDetails: QuizDetails,
    loadMoreQuestions = false
  ): Observable<Quiz> {
    // Check if topic is already in the cache
    const cacheKey =
      quizDetails.topic +
      '+' +
      quizDetails.subTopic +
      '+' +
      quizDetails.difficulty;
    if (!loadMoreQuestions && this.quizCache.has(cacheKey)) {
      return of({
        topic: quizDetails.topic,
        subTopic: quizDetails.subTopic,
        difficulty: quizDetails.difficulty,
        questions: this.quizCache.get(cacheKey)!,
      });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const requestBody = getRequestBody(quizDetails, loadMoreQuestions);

    return this.http
      .post<ResponseModel>(this.apiUrl, requestBody, { headers })
      .pipe(
        map((response) => {
          try {
            // Extract and parse JSON response
            const rawText = response.message.content[0].text;
            const jsonText = extractJson(rawText);
            const quizData = JSON.parse(jsonText) as Quiz;

            this.formatQuestion(quizData);

            let prevLen = this.quizCache.get(cacheKey)?.length || 0;
            // Append new questions to cache
            this.appendToCache(quizDetails, quizData.questions);

            return {
              topic: quizDetails.topic,
              subTopic: quizDetails.subTopic,
              difficulty: quizDetails.difficulty,
              questions: this.quizCache.get(cacheKey)?.slice(prevLen) || [],
            } as Quiz;
          } catch (error) {
            alert(
              'Internal Server Error Occurred while generating the quiz, you can start the quiz again or try another topic.'
            );
            console.error('Error parsing quiz JSON:', error);
            return {
              topic: quizDetails.topic,
              subTopic: quizDetails.subTopic,
              difficulty: quizDetails.difficulty,
              questions: [],
            } as Quiz;
          }
        })
      );
  }

  /** Append New Questions to Cache */
  private appendToCache(
    quizDetails: QuizDetails,
    newQuestions: Question[]
  ): void {
    const cacheKey =
      quizDetails.topic +
      '+' +
      quizDetails.subTopic +
      '+' +
      quizDetails.difficulty;
    const existingQuestions = this.quizCache.get(cacheKey) || [];
    const updatedQuestions = this.mergeUniqueQuestions(
      existingQuestions,
      newQuestions
    );

    // Update cache
    this.quizCache.set(cacheKey, updatedQuestions);

    // Notify subscribers of the new global state
    this.questionsSubject.next(new Map(this.quizCache));
  }

  formatQuestion(response: Quiz): void {
    // Replace `code` with <code>code</code>
    response.questions.forEach((q) => {
      q.question = q.question.replace(/`([^`]+)`/g, '<code>$1</code>');
      q.options.forEach((option) => {
        option = option.replace(/`([^`]+)`/g, '<code>$1</code>');
      });
    });
  }

  mergeUniqueQuestions(arr1: Question[], arr2: Question[]): Question[] {
    const seen = new Set<string>();
    const merged = [...arr1, ...arr2].filter((q) => {
      if (seen.has(q.question)) {
        return false;
      }
      seen.add(q.question);
      return true;
    });
    return merged;
  }

  get quizCategoriesList(): {} {
    return this.quizCategories;
  }

  private score = 0;

  setScore(score: number) {
    this.score = score;
  }

  getScore(): number {
    return this.score;
  }
}
