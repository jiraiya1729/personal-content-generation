export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export interface QuizState {
    currentQuestion: number;
    selectedAnswers: (string | null)[];
    score: number;
  }