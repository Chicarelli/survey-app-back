import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateSurveyDto } from './dto/createSurvey.dto';
import { Survey, SurveyDocument } from './schemas/survey.schema';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { Answer, AnswerDocument, AnswerProp } from './schemas/answer.schema';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
  ) {}

  async createSurvey(
    createSurveyDto: CreateSurveyDto,
    user: User,
  ): Promise<Survey> {
    console.log(`Creating survey ${createSurveyDto.title} from ${user.email}`);
    const createdSurvey = new this.surveyModel({
      owner: user,
      ...createSurveyDto,
    });

    await createdSurvey.save();

    return createdSurvey;
  }

  async createAnswer(
    surveyId,
    createAnswerDto: CreateAnswerDto,
    user: User | null,
    connectionId: string,
  ) {
    console.log(`Creating a new answer to survey: ${surveyId}`);

    const survey = await this.findSurveyByIdOrThrowError(surveyId);

    await this.valideUserToAnswer(survey, user, connectionId);

    this.checkAnswers(survey, createAnswerDto.answers);

    const answer = new this.answerModel();
    answer.answer = createAnswerDto.answers;
    answer.connectionId = connectionId;
    answer.owner = user;

    console.log(`Registering answer ${answer.id} of survey ${surveyId}`);

    await answer.save();

    return answer;
  }

  private checkAnswers(survey: Survey, answers: AnswerProp[]): void {
    const questions = survey.questions;

    console.log(`checking if the answeres are correct`);

    questions.forEach((question, index) => {
      const questionAnswer: AnswerProp = answers.find((answer) => {
        return Number(answer.question_key) == index;
      });

      if (question.required && !!questionAnswer.option_key) {
        throw new Error('Existem perguntas obrigatórios não respondidas');
      }
    });
  }

  private async userAlreadyAnswered(
    connectionId: string,
    user: User,
  ): Promise<boolean> {
    const answersByUser = await this.answerModel.findOne({ owner: user });

    if (answersByUser) {
      return true;
    }

    const answerByConnection = await this.answerModel.findOne({ connectionId });

    if (answerByConnection) {
      return true;
    }

    return false;
  }

  private async findSurveyByIdOrThrowError(surveyId: string): Promise<Survey> {
    console.log(`Trying to find survey: ${surveyId}`);
    const survey = await this.surveyModel.findById(surveyId);

    if (!survey) {
      throw new Error('Pesquisa não encontrada');
    }

    return survey;
  }

  private async valideUserToAnswer(
    survey: Survey,
    user: User | null,
    connectionId: string,
  ): Promise<void> {
    console.log(
      `Validating if the survey ${survey.title} is valid to this user`,
    );

    const userAlreadyAnswered = await this.userAlreadyAnswered(
      connectionId,
      user,
    );

    if (userAlreadyAnswered && survey.isUniqueAnswer) {
      throw new Error('Usuário já respondeu essa pesquisa');
    }
  }
}
