import { Controller, Post, Body, Param } from '@nestjs/common';
import { Req, Res } from '@nestjs/common/decorators';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { CreateSurveyDto } from './dto/createSurvey.dto';
import { SurveyService } from './survey.service';

@Controller('survey')
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/')
  async createSurvey(
    @Body() createSurveyDto: CreateSurveyDto,
    @Req() req,
    @Res() res,
  ) {
    const { email } = req.headers;
    const user: User = await this.usersService.findByEmail(email);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    try {
      const createdSurvey = await this.surveyService.createSurvey(
        createSurveyDto,
        user,
      );

      return res.status(201).send(createdSurvey);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  @Post('/:surveyId/answer')
  async createAnswer(
    @Param('surveyId') surveyId: string,
    @Body() createAnswerDto: CreateAnswerDto,
    @Req() req,
    @Res() res,
  ) {
    console.log(`Creating answer for survey ${surveyId}`);
    let user = null;
    const connectionId = req.ip;

    if (req?.headers?.email) {
      console.log(`userconnected: ${req.headers.email}`);
      user = this.usersService.findByEmail(req?.headers?.email);
    }

    try {
      const result = await this.surveyService.createAnswer(
        surveyId,
        createAnswerDto,
        user,
        connectionId,
      );
      return res.status(201).send({ answer: result });
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  }
}
