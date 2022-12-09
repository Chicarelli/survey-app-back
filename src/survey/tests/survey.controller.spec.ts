import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, response, Response } from 'express';
import { UsersService } from '../../users/users.service';
import { CreateSurveyDto } from '../dto/createSurvey.dto';
import { SurveyController } from '../survey.controller';
import { SurveyService } from '../survey.service';

describe('SurveyController', () => {
  let controller: SurveyController;
  let service: SurveyService;
  let userService: UsersService;
  const request = {} as Request;
  const res = {} as Response;

  res.status = (status: number) => {
    res.statusCode = status;
    return res;
  };

  res.send = (obj) => {
    return obj;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyService,
        UsersService,
        { provide: getModelToken('User'), useValue: {} },
        { provide: getModelToken('Survey'), useValue: {} },
        { provide: getModelToken('Answer'), useValue: {} },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    service = module.get<SurveyService>(SurveyService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('CreateSurvey', () => {
    it('Deve retornar 404 se usuário não for encontrado', async () => {
      request.headers = { email: 'algumemail@email.com' };

      jest
        .spyOn(userService, 'findByEmail')
        .mockImplementation(() => Promise.resolve(null));

      const result = await controller.createSurvey(
        {} as CreateSurveyDto,
        request,
        res,
      );

      expect(res.statusCode).toEqual(404);
      expect(result).toEqual({ message: 'User not found' });
    });
  });
});
