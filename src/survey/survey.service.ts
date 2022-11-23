import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { CreateSurveyDto } from './dto/createSurvey.dto';
import { Survey } from './schemas/survey.schema';

@Injectable()
export class SurveyService {
  async createSurvey(
    createSurveyDto: CreateSurveyDto,
    user: User,
  ): Promise<Survey> {
    if (!this.isValidSurvey(createSurveyDto)) {
      throw new Error('Não é uma pesquisa válida');
    }

    return new Survey();
  }

  private isValidSurvey(survey: CreateSurveyDto): boolean {
    return true;
  }
}
