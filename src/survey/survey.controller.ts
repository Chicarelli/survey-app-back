import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { Query, Req, Res } from '@nestjs/common/decorators';
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

  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
    @Query('userId') userId: string | null,
    @Req() req,
    @Res() res,
  ) {
    try {
      if (userId) {
        const user = await this.usersService.findById(userId);

        if (!user) {
          return res.status(404).send({ message: 'Usuário não encontrado' });
        }
      }

      if (isNaN(page) || isNaN(perPage)) {
        return res
          .status(400)
          .send({ message: 'Dados de paginação inválidos' });
      }

      const skipNumber = perPage * (page - 1);

      const result = await this.surveyService.findAllSurvey(
        skipNumber,
        perPage,
        userId,
      );

      return res.status(200).send({ surveys: result });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  }

  @Post('/:surveyId/answer')
  async createAnswer(
    @Param('surveyId') surveyId: string,
    @Body() createAnswerDto: CreateAnswerDto,
    @Req() req,
    @Res() res,
  ) {
    const connectionId = req.ip;

    const user = req?.headers?.email
      ? await this.usersService.findByEmail(req.headers.email)
      : null;

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

  @Get('/:surveyId')
  async getSurveyById(
    @Param('surveyId') surveyId: string,
    @Req() req,
    @Res() res,
  ) {
    const result = await this.surveyService.getSurveyById(surveyId);

    return result
      ? res.status(200).send({ survey: result })
      : res.status(404).send({ message: 'Pesquisa não encontrada' });
  }

  @Get(':surveyId/answers')
  async getSurveyAnswers(
    @Param('surveyId') surveyId: string,
    @Res() res,
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
  ) {
    try {
      const survey = await this.surveyService.getSurveyById(surveyId);

      if (!survey) {
        return res.status(404).send({ message: 'Pesquisa não encontrada' });
      }

      const skipNumber = perPage * (page - 1);
      const answers = await this.surveyService.getAllAnswersFrom(
        surveyId,
        skipNumber,
        perPage,
      );

      return res.status(200).send({ answers });
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Erro na busca das respostas desta pesquisa' });
    }
  }
}
