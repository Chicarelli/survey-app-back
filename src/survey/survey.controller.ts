import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Req, Res } from '@nestjs/common/decorators';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
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
      this.surveyService.createSurvey(createSurveyDto, user);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
}
