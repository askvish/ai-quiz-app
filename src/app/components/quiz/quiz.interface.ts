export interface Quiz {
  topic: string;
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}
