import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateSurveyDto, Question } from './dto/createSurvey.dto';
import { Survey, SurveyDocument } from './schemas/survey.schema';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
  ) {}

  async createSurvey(
    createSurveyDto: CreateSurveyDto,
    user: User,
  ): Promise<Survey> {
    this.isValidSurvey(createSurveyDto);

    console.log(`Creating survey ${createSurveyDto.title} from ${user.email}`);
    const createdSurvey = new this.surveyModel({
      owner: user,
      ...createSurveyDto,
      finalDate: this.treatSurveyFinalDate(createSurveyDto.finalDate),
    });

    console.log(`Saving survey`);
    await createdSurvey.save();

    return createdSurvey;
  }

  private isValidSurvey(survey: CreateSurveyDto): void {
    this.isQuestionsValid(survey.questions);

    if (survey.title.replace(/\s/g, '').length === 0) {
      throw new Error('Nome inválido');
    }
  }

  private isQuestionsValid(questions: Question[]): void {
    console.log(`Checking if it is a valid survey`);
    this.checkIfThereIsMinimumQuestions(questions.length);
    this.checkEmptyQuestions(questions);
    this.checkQuestionsAnswers(questions);
  }

  private checkIfThereIsMinimumQuestions(
    questions: number | Array<Question>,
  ): void {
    console.log(`Checking if there is a Minimum question`);
    const MINIMUM_QUESTION = 2;
    let numberOfQuestions: number;

    if (typeof questions === 'object') {
      numberOfQuestions = questions.length;
    } else {
      numberOfQuestions = Number(questions);
    }

    if (numberOfQuestions < MINIMUM_QUESTION)
      throw new Error('Pesquisa tem que ter pelo menos duas questões');
  }

  private checkEmptyQuestions(questions: Array<Question>): void {
    console.log(`Checking if there is some empty question`);
    questions.forEach((question) => {
      if (
        !question.question ||
        question.question.replace(/\s/g, '').length == 0
      ) {
        throw new Error('Questões vazias não são permitidas');
      }
    });
  }

  private checkQuestionsAnswers(questions: Array<Question>): void {
    console.log(`Cheking questions answers`);
    questions.forEach((question) => {
      if (question.answers.length < 2) {
        throw new Error('Questões precisam ter pelo menos duas alternativas');
      }
    });
  }

  private treatSurveyFinalDate(finalDate: string): string {
    const date = new Date(finalDate);

    if (isNaN(Number(date)) || !finalDate) {
      return '';
    }

    return date.toString();
  }
}
