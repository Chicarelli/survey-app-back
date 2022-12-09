import { Controller, Body, Post, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Res } from '@nestjs/common/decorators';
import { LoginDto } from './dto/LoginDto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    console.log(`Trying to loggin with email: ${loginDto.email}`);
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    try {
      const result = await this.authService.login(loginDto, user);

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  //Route to test middleware. After, it could be an route to change password and w/e
  @Get('/test')
  async test(@Headers() headers) {
    return 'test';
  }
}
