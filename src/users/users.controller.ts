import { Controller, Body, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersService } from './users.service';
import { Res } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res) {
    console.log(`Creating an user`);
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) {
      console.error(`This UserEmail already exists`);
      return res.status(400).send({ message: 'User already exists' });
    }

    try {
      this.usersService.create(createUserDto);
      return res.sendStatus(201);
    } catch (error) {
      console.error(
        `Got an error trying to creating new user: ${error.message}`,
      );
      res.sendStatus(500);
    }
  }
}
