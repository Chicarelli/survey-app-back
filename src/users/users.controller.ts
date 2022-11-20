import { Controller, Body, Post, Get, Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersService } from './users.service';
import { Res } from '@nestjs/common/decorators';

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
}
