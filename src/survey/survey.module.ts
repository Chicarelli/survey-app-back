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

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Survey.name, schema: SurveySchema },
    ]),
  ],
})
export class SurveyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthValidateMiddleware)
      .forRoutes({ path: 'survey', method: RequestMethod.POST });
  }
}
