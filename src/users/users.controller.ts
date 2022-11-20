import { Controller, Body, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersService } from './users.service';
import { Res } from '@nestjs/common/decorators';
import { LoginDto } from './dto/LoginDto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res) {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) {
      return res.status(400).send({ message: 'User already exists' });
    }

    try {
      this.usersService.create(createUserDto);
      res.sendStatus(201);
      return;
    } catch (error) {
      res.sendStatus(500);
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    try {
      const result = await this.usersService.login(loginDto, user);

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
}
