import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';

export class CreateSurveyDto {
  isPublic: boolean;
  isUniqueAnswer: boolean;
  description: string;
  finalDate: string;
  limitAnswer: null | number;
  @IsArray()
  questions: Question[];

  @IsNotEmpty()
  @IsString()
  title: string;
}

export class Question {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsNotEmptyObject()
  answers: string[];

  required: boolean;
}
