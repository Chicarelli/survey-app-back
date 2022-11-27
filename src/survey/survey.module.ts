import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Survey, SurveySchema } from './schemas/survey.schema';
import { UsersService } from 'src/users/users.service';
import { AuthValidateMiddleware } from 'src/middleware/authValidate.middleware';
import { GetUserMiddleware } from 'src/middleware/getUser.middleware';
import { Answer, AnswerSchema } from './schemas/answer.schema';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Survey.name, schema: SurveySchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
})
export class SurveyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetUserMiddleware, AuthValidateMiddleware)
      .forRoutes({ path: 'survey', method: RequestMethod.POST });
  }
}
