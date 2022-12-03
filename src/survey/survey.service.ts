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

  async getAllSurveyFromUser(userId: string): Promise<Array<Survey>> {
    console.log(`Trying to get all surveys from users: ${userId}`);
    const usersList = await this.surveyModel.find({ owner: userId });
    return usersList;
  }

  async getSurveyById(surveyId: string): Promise<Survey> {
    console.log(`Trying to find surveyById: ${surveyId}`);
    const survey = await this.surveyModel.findById(surveyId);

    return survey;
  }

  async createAnswer(
    surveyId: string,
    createAnswerDto: CreateAnswerDto,
    user: User | null,
    connectionId: string,
  ) {
    console.log(`Creating a new answer to survey: ${surveyId}`);

    const survey = await this.findSurveyByIdOrThrowError(surveyId);

    await this.valideUserToAnswer(survey, user, connectionId);

    const answer = new this.answerModel(user, survey, createAnswerDto);
    answer.connectionId = connectionId;

    console.log(`Registering answer ${answer.id} of survey ${surveyId}`);

    await answer.save();

    return answer;
  }

  async findAllSurvey(
    skip: number,
    perPage: number,
    userId: string | null,
  ): Promise<Array<Survey>> {
    const searchObj = userId ? { owner: userId } : {};
    console.log(
      `Trying to find surveys: Skip: ${skip}, perPage: ${perPage} from userId: ${userId}, and obj: `,
      searchObj,
    );

    const result = await this.surveyModel.find().skip(skip).limit(perPage);

    console.log(`FindSurveys: ${result.length}`);
    return result;
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
