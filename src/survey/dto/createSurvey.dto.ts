export interface CreateSurveyDto {
  isPublic: boolean;
  isUniqueAnswer: boolean;
  title: string;
  description: string;
  finalDate: string;
  limitAnswer: null | number;
  questions: Question[];
}

export interface Question {
  question: string;
  answers: string[];
  required: boolean;
}
